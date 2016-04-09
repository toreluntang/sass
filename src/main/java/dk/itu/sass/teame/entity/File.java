package dk.itu.sass.teame.entity;

import java.nio.file.Path;
import java.time.Instant;

public class File {

	private long id;
	private long userId;
	private Path path;
	private Instant timestamp;
	
	private String username; // SEE COMMENT ON GETTERSETTER
	
	public File() {
	}
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	
	public long getUserId() {
		return userId;
	}
	
	public void setUserId(long userId) {
		this.userId = userId;
	}
	
	public Path getPath() {
		return path;
	}
	
	public void setPath(Path path) {
		this.path = path;
	}
	
	public Instant getTimestamp() {
		return timestamp;
	}
	
	public void setTimestamp(Instant timestamp) {
		this.timestamp = timestamp;
	}
	
	
	@Override
	public String toString() {
		return "File [id=" + id + ", userId=" + userId + ", path=" + path + ", timestamp=" + timestamp + "]";
	}

	
	// DOESNT BELONG IN FILE OR COMMENT (SHOULD BE IN DTO)
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	
	
	
	
}
