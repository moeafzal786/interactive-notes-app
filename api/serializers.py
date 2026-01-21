from rest_framework import serializers
from .models import Note, Tag, NoteTag

# --- Tag serializer ---
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


# --- NoteTag serializer (junction table) ---
class NoteTagSerializer(serializers.ModelSerializer):
    tag = TagSerializer(read_only=True)

    class Meta:
        model = NoteTag
        fields = ['id', 'note', 'tag']


# --- Note serializer with tag support ---
class NoteSerializer(serializers.ModelSerializer):
    # Accept tags as a list of strings when creating/updating
    tags = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    # Return tags as names when reading
    tag_names = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Note
        fields = [
            'id',
            'title',
            'content',
            'created_at',
            'updated_at',
            'tags',
            'tag_names',
            'user',
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_tag_names(self, obj):
        # Return all tag names linked to this note
        return [nt.tag.name for nt in obj.note_tags.all()]

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        # ✅ Don't assign user here — perform_create handles it
        note = super().create(validated_data)
        for tag_name in tags:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            NoteTag.objects.create(note=note, tag=tag)
        return note

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', [])
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.save()

        if tags:
            # Clear old tags and reassign
            instance.note_tags.all().delete()
            for tag_name in tags:
                tag, _ = Tag.objects.get_or_create(name=tag_name)
                NoteTag.objects.create(note=instance, tag=tag)

        return instance