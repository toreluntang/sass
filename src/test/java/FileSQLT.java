import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;

import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;

import com.google.gson.Gson;
import com.google.gson.JsonArray;

import dk.itu.sass.teame.controller.CommentController;
import dk.itu.sass.teame.controller.FileController;
import dk.itu.sass.teame.entity.File;
import dk.itu.sass.teame.postgresql.FileSQL;


public class FileSQLT {
	
	@Test
	public void test(){
		java.nio.file.Path  p = Paths.get("/home/");
		
		File f = new File();
		f.setPath(p);
		f.setTimestamp(Instant.now());
		f.setUserId(1337);
		
		FileSQL filesql = new FileSQL();
		f = filesql.insertFile(f);
		System.out.println("test done ");

	}

}
