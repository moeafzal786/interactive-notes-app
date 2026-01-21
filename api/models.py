from django.db import models
from django.contrib.auth.models import User  # built-in Django User

# Note model
class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to built-in User
    title = models.CharField(max_length=100)                  # Short text field
    content = models.TextField()                              # Long text field
    created_at = models.DateTimeField(auto_now_add=True)      # Auto timestamp
    updated_at = models.DateTimeField(auto_now=True)          # ✅ Auto update timestamp

    def __str__(self):
        return self.title

# Tag model
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)   # Simple label for categorizing notes

    def __str__(self):
        return self.name

# NoteTag model (junction table)
class NoteTag(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name="note_tags")
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name="tagged_notes")

    def __str__(self):
        return f"{self.note.title} → {self.tag.name}"