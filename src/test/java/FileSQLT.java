import java.util.List;

import org.junit.Test;

import com.google.gson.JsonArray;

import dk.itu.sass.teame.controller.AccountController;
import dk.itu.sass.teame.entity.Account;
import dk.itu.sass.teame.entity.Comment;
import dk.itu.sass.teame.postgresql.AccountSQL;
import dk.itu.sass.teame.postgresql.CommentSQL;

public class FileSQLT {
	
	@Test
	public void test(){
		CommentSQL c = new CommentSQL();
		JsonArray a = c.getComments("0; select * from account;");
		System.out.println(a.toString());

	}

}
