import java.util.List;

import org.junit.Test;

import dk.itu.sass.teame.controller.AccountController;
import dk.itu.sass.teame.entity.Account;
import dk.itu.sass.teame.postgresql.AccountSQL;

public class FileSQLT {
	
	@Test
	public void test(){
		AccountSQL a = new AccountSQL();
		
		List<Account> al = a.getAllAccounts();
		
		for(Account aa : al)
			System.out.println(aa.getUsername());
		
		AccountController ac = new AccountController();
		
		String s = ac.getAllusers();
		System.out.println("se her " + s);

	}

}
