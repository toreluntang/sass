import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import org.junit.Test;

import com.google.gson.JsonArray;

import dk.itu.sass.teame.controller.AccountController;
import dk.itu.sass.teame.entity.Account;
import dk.itu.sass.teame.entity.Comment;
import dk.itu.sass.teame.postgresql.AccountSQL;
import dk.itu.sass.teame.postgresql.CommentSQL;
import net.jalg.hawkj.Algorithm;
import net.jalg.hawkj.AuthorizationHeader;
import net.jalg.hawkj.HawkContext;

public class FileSQLT {

	@Test
	public void test() throws Exception {
		java.nio.file.Path p = Paths.get("", "Readme.txt");// #fail

		System.out.println("tst");
		List<String> strs = Files.readAllLines(p);
		for (String s : strs) {
			System.out.println(s);
		}
	}

	public void test1() {
		CommentSQL c = new CommentSQL();
		JsonArray a = c.getComments("0; select * from account;");
		System.out.println(a.toString());
	}

	@Test
	public void testests() {
		
		
		
		HawkContext hawk = HawkContext.request("POST", "/sec/resources/protected/file", "localhost", 8080)
                .credentials("33", "c706872d-e0d9-43ee-9b5a-8726fcbfa051", Algorithm.SHA_256)
                .tsAndNonce(1461004419,"XcwxRJ")
                .hash(null).build();

		System.out.println(hawk);
		
		AuthorizationHeader hej = hawk.createAuthorizationHeader();
//		System.out.println("FALSE because: " + authHeader.getMac() + " is not equal to .... #fail - " + hej.getMac());
		
		
		
	}

}
