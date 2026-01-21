from django.contrib import admin
from .models import Note, Tag, NoteTag

# Custom admin for Note
@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at')
    search_fields = ('title', 'content')
    list_filter = ('created_at', 'user')
    ordering = ('-created_at',)

# Custom admin for Tag
@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)

# Custom admin for NoteTag (junction table)
@admin.register(NoteTag)
class NoteTagAdmin(admin.ModelAdmin):
    list_display = ('note', 'tag')
    search_fields = ('note__title', 'tag__name')
    list_filter = ('tag', 'note')