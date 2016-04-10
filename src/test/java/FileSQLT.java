import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import org.junit.Test;

import dk.itu.sass.teame.controller.AccountController;
import dk.itu.sass.teame.entity.Account;
import dk.itu.sass.teame.postgresql.AccountSQL;

public class FileSQLT {
	
	@Test
	public void test() throws Exception{
		java.nio.file.Path p = Paths.get("", "Readme.txt");// #fail
		
		System.out.println("tst");
		List<String> strs = Files.readAllLines(p);
		for(String s : strs )
		{
			System.out.println(s);
		}


	}

}
