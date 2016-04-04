package dk.itu.sass.teame.controller;
import java.time.LocalDateTime;
import java.util.List;

import javax.ejb.Stateless;

import dk.itu.sass.teame.entity.Comment;
import dk.itu.sass.teame.postgresql.CommentSQL;

@Stateless
public class CommentController {

	public long addComment(String body, long userId, long imageId) {
		
		CommentSQL commentSQL = new CommentSQL();
		String timestamp = LocalDateTime.now().toString();
		Comment newComment = new Comment(body, timestamp, userId, -1, imageId);
		long commentId = commentSQL.insertComment(newComment);
		newComment.setCommentId(commentId); // Kind of doesnt matter. 

		return commentId;
	}
	
	public String getComments(long imageId){
		
		CommentSQL commentSQL = new CommentSQL();
		
		List<Comment> comments = commentSQL.getComments(imageId);
		
		
	}
}