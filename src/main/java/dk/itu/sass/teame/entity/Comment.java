package dk.itu.sass.teame.entity;

public class Comment {
	private int commentid;
	private String body;
	private int userid;
	private String timestamp;
	private int imageid;

	public Comment(String body, String timestamp, int userid, int commentid, int imageid) {
		this.commentid = commentid;
		this.body = body;
		this.userid = userid;
		this.timestamp = timestamp;
		this.imageid = imageid;
	}
	public int getCommentid() {
		return this.commentid;
	}
	public void setCommentid(int commentid) {
		this.commentid = commentid;
	}

	public String getBody() {
		return this.body;
	}
	public void setBody(String body) {
		this.body = body;
	}

	public int getUserid() {
		return this.userid;
	}
	public void setUserid(int userid) {
		this.userid = userid;
	}

	public String getTimestamp() {
		return this.timestamp;
	}
	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}

	public int getImageid() {
		return this.imageid;
	}
	public void setImageid(int imageid) {
		this.imageid = imageid;
	}


}