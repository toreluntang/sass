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
		
		CommentController cc = new CommentController();
		String s = cc.getComments(1L);
		
		
		FileSQL fileSQL = new FileSQL();
		List<File> images = fileSQL.selectFilesByUserId(1L);
		Assert.assertEquals("images should be 3, and was: " + images.size(), 3, images.size());
		
		FileController fc = new FileController();
		
		String json = fc.getFilesByUser(1L);
		JsonArray jsonArr = new Gson().fromJson(json, JsonArray.class);
		
		Assert.assertEquals("was: "+jsonArr, 3, jsonArr.size());

	}

}
