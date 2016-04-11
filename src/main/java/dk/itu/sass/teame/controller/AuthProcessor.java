package dk.itu.sass.teame.controller;

import java.net.URI;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.container.ContainerRequestContext;
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
			long accountId = Long.parseLong(authHeader.getId());
			Account acc = AccountController.getAccountById(accountId);
			String path = requestContext.getRequestURI();
			String host = requestContext.getServerName();
			int port = requestContext.getServerPort();
			HawkContext hawk = HawkContext.request(requestContext.getMethod(), path, host, port)
			                     .credentials(""+acc.getAccountid(), acc.getKeyId(), Algorithm.SHA_256)
			                     .tsAndNonce(authHeader.getTs(), authHeader.getNonce())
			                     .hash(null).build();
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
