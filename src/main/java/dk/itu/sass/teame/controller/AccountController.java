package dk.itu.sass.teame.controller;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.UUID;

import javax.ejb.Stateless;
import javax.inject.Inject;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import dk.itu.sass.teame.entity.Account;
import dk.itu.sass.teame.postgresql.AccountSQL;

@Stateless
public class AccountController {
	
	@Inject
	AccountSQL accountSQL;
	
	public Account getAccount(String username){
		AccountSQL accountSQL = new AccountSQL();
		Account a = accountSQL.getAccountByString("username",username);
		return a;
	}
	
	public static Account getAccountById(long accountId){
		AccountSQL accountSQL = new AccountSQL();
		Account a = accountSQL.getAccountByString("accountid",""+accountId);
		return a;
	}
	
	public boolean validateUsername(String username) {
		return getAccount(username) == null;
	}
	
	public Account insertAccount(String username, String password, String email){
		
		try {

			String hashedPassword;
			hashedPassword = PasswordHash.createHash(password);
			Account newAccount = new Account(username, hashedPassword, "", email, UUID.randomUUID().toString());
			
			long newAccountId = accountSQL.insertUser(newAccount);
			newAccount.setAccountid(newAccountId);
			
			return newAccount;
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (InvalidKeySpecException e) {
			e.printStackTrace();
		}
		
		return null;
	}

	public Account login(String username, String password) {
		
		
		Account acc = new Account();
		acc.setUsername(username);
		
		acc = accountSQL.checkLogin(acc);
		
		try {
			if(PasswordHash.validatePassword(password, acc.getPassword())) {
				acc.setKeyId(UUID.randomUUID().toString());
				if(accountSQL.updateKey(acc))
					return acc;
			}
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (InvalidKeySpecException e) {
			e.printStackTrace();
		}
			
		return null;
	}

	public String getAllusers() {
		accountSQL = new AccountSQL();
		JsonArray jsonArray = new JsonArray();
		for(Account a : accountSQL.getAllAccounts()){
			
			JsonObject o = new JsonObject();
			o.addProperty("accountid", a.getAccountid());
			o.addProperty("username", a.getUsername());
			
			jsonArray.add(o);
		}
		
		return jsonArray.toString();
	}

}