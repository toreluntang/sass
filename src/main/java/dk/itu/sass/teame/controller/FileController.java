package dk.itu.sass.teame.controller;

import java.nio.file.Path;
import java.time.Instant;

import javax.ejb.Stateless;
import javax.inject.Inject;

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

}
