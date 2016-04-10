package dk.itu.sass.teame.entity;

import java.time.Instant;

public class Comment {
	
	private long commentId;
	private String body;
	private long userId;
	private Instant timestamp;
	private long imageId;
	private String username;

	public Comment(String body, Instant timestamp, long userId, long commentId, long imageId) {
		this.commentId = commentId;
		this.body = body;
		this.userId = userId;
		this.timestamp = timestamp;
		this.imageId = imageId;
	}
	
	public long getCommentId() {
		return this.commentId;
	}
	
	public void setCommentId(long commentid) {
		this.commentId = commentid;
	}

	public String getBody() {
		return this.body;
	}
	
	public void setBody(String body) {
		this.body = body;
	}

	public long getUserId() {
		return this.userId;
	}
	
	public void setUserId(int userid) {
		this.userId = userid;
	}

	public Instant getTimestamp() {
		return this.timestamp;
	}
	
	public void setTimestamp(Instant timestamp) {
		this.timestamp = timestamp;
	}

	public long getImageId() {
		return this.imageId;
	}
	
	public void setImageId(int imageid) {
		this.imageId = imageid;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
}