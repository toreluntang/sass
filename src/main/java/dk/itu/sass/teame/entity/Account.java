package dk.itu.sass.teame.entity;

public class Account {
	private long accountid;
	private String username;
	private String password;
	private String salt;
	private String email;
	private String keyId;
	
	public Account() {
	}
	
	public Account(String username, String password, String salt, String email, String keyid) {
		this.username = username;
		this.password = password;
		this.salt = salt;
		this.email = email;
		this.keyId = keyid;
	}
	
	public Account(int accountid, String username, String password, String salt, String email) {
		this.accountid = accountid;
		this.username = username;
		this.password = password;
		this.salt = salt;
		this.email = email;
	}
	
	public long getAccountid() {
		return accountid;
	}

	public void setAccountid(long accountid) {
		this.accountid = accountid;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getSalt() {
		return salt;
	}

	public void setSalt(String salt) {
		this.salt = salt;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getKeyId() {
		return keyId;
	}

	public void setKeyId(String keyId) {
		this.keyId = keyId;
	}
	
	
	
}
