package dk.itu.sass.teame.controller;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;


import javax.ejb.Stateless;

import org.apache.commons.lang3.StringEscapeUtils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

import dk.itu.sass.teame.entity.Comment;
import dk.itu.sass.teame.postgresql.CommentSQL;

@Stateless
public class CommentController {

	public long addComment(String body, long userId, long imageId) {
		
		CommentSQL commentSQL = new CommentSQL();
		Comment newComment = new Comment(body, Instant.now(), userId, -1, imageId);
		long commentId = commentSQL.insertComment(newComment);
		newComment.setCommentId(commentId); // Kind of doesnt matter. 

		
		
		return commentId;
	}
		
	public String getComments(long imageId){
		
		CommentSQL commentSQL = new CommentSQL();
		
		List<Comment> comments = commentSQL.getComments(imageId);
		
		for(Comment c : comments){
			c.setBody(StringEscapeUtils.escapeHtml4( c.getBody() ));
		}
		
//		Gson gson = new Gson();
		Gson gson = new GsonBuilder().disableHtmlEscaping().create(); 
		String json = gson.toJson(comments);
		
		return json;
	}
}