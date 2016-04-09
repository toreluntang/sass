package dk.itu.sass.teame.controller;

import java.nio.file.Path;
import java.time.Instant;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import dk.itu.sass.teame.entity.File;
import dk.itu.sass.teame.postgresql.FileSQL;

@Stateless
public class FileController {
	
	@Inject
	private FileSQL fileSQL;

	public FileController() {}
	
	public File uploadFile(Long userId, Path path) { 

		File file = new File();
		file.setUserId(userId);
		file.setPath(path);
		file.setTimestamp(Instant.now());
		
		return fileSQL.insertFile(file);
	}

	public File getFile(long id) {
	
		File file = new File();
		file.setId(id);
		
		return fileSQL.selectFileById(file);
	}
	
	public String getFilesByUser(long userId){
		
		FileSQL fileSQLfail = new FileSQL();
		
		List<File> images = fileSQLfail.selectFilesByUserId(userId);
		
		JsonArray jsonArray = new JsonArray();
		for(File f : images){
			JsonObject o = new JsonObject();
			o.addProperty("imageid", f.getId());
			o.addProperty("author", f.getUserId());
			o.addProperty("path", f.getPath().toString());
			o.addProperty("timestamp", f.getTimestamp().toString());
			o.addProperty("username", f.getUsername());
			System.out.println(o);
			jsonArray.add(o);
		}
		
		return jsonArray.toString();
	}

	public boolean shareImage(long imageId, long authorId, long shareWithId) {
		
		boolean res = false;
		File f = getFile(imageId);
		
		if(f.getUserId() == authorId){
			int rows = fileSQL.shareImage(imageId, shareWithId);
			if(rows > 0) 
				res = true;
		}
		
		return res;
	}

}
