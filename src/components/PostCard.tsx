"use client";

import Link from "next/link";
import { Post } from "../store/postStore";
import { Edit, Trash2, Calendar, Tag } from "lucide-react";

interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export default function PostCard({
  post,
  onEdit,
  onDelete,
  showActions = false,
}: PostCardProps) {
  const handleEdit = () => {
    onEdit?.(post);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      onDelete?.(post.id);
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-border">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 line-clamp-2">
              {post.title}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : "Unknown date"}
                </span>
              </div>
              {post.category && (
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs w-fit">
                  {post.category}
                </span>
              )}
            </div>
          </div>

          {showActions && (
            <div className="flex items-center space-x-2 ml-2 sm:ml-4 flex-shrink-0">
              <button
                onClick={handleEdit}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                title="Edit post"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                title="Delete post"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <p className="text-muted-foreground mb-4 line-clamp-3">{post.body}</p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border space-y-2 sm:space-y-0">
          <span className="text-sm text-muted-foreground">
            Post ID: {post.id}
          </span>
          {!showActions && (
            <Link
              href={`/posts/view/${post.id}`}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
            >
              Read more →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
