package dk.itu.sass.teame.controller;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


import javax.ejb.Stateless;

import org.apache.commons.lang3.StringEscapeUtils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
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
		
	public String getComments(String imageId){
		
		CommentSQL commentSQL = new CommentSQL();
		List<Comment> comments = new ArrayList<>();
		
		JsonArray comment = commentSQL.getComments(imageId);
		JsonArray jsonArray = new JsonArray();
		
		for(Comment c : comments){
			JsonObject o = new JsonObject();
			//c.setBody(StringEscapeUtils.escapeHtml4( c.getBody() ));
			
			o.addProperty("commentId", c.getCommentId());
			o.addProperty("body", c.getBody());
			o.addProperty("userId", c.getUserId());
			o.addProperty("timestamp", c.getTimestamp().toString());
			o.addProperty("imageId", c.getImageId());
			o.addProperty("username", c.getUsername());
			
			jsonArray.add(o);
		}
		
		return comment.toString();
	}
}