package dk.itu.sass.teame.controller;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.HttpHeaders;

import dk.itu.sass.teame.entity.Account;
import net.jalg.hawkj.Algorithm;
import net.jalg.hawkj.AuthorizationHeader;
import net.jalg.hawkj.HawkContext;

public class AuthProcessor {

	public static boolean Authenticate(HttpServletRequest requestContext) {
		try {
			AuthorizationHeader authHeader = AuthorizationHeader.authorization(
			         requestContext.getHeader(HttpHeaders.AUTHORIZATION));

			System.out.println("auth header: "+authHeader);
			
			System.out.println(authHeader.getId());

			long accountId = Long.parseLong(authHeader.getId());
			System.out.println("Parsed Long id= " + accountId);
			Account acc = AccountController.getAccountById(accountId);
			
			System.out.println("ACcount is="+acc);
			System.out.println("TS="+authHeader.getTs());
			System.out.println("NONCE="+authHeader.getNonce());
			System.out.println("KEYID="+acc.getKeyId());

			String path = requestContext.getRequestURI();
			String host = requestContext.getServerName();
			int port = requestContext.getServerPort();
			HawkContext hawk = HawkContext.request(requestContext.getMethod(), path, host, port)
			                     .credentials(""+acc.getAccountid(), acc.getKeyId(), Algorithm.SHA_256)
			                     .tsAndNonce(authHeader.getTs(), authHeader.getNonce())
			                     .hash(null).build();
			
			System.out.println(hawk);
			
			if (hawk.isValidMac(authHeader.getMac())) {
			      return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			System.out.println(e);
			return false;
		}
	}
	
}
