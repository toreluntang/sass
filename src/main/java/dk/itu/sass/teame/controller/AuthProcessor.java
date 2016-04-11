package dk.itu.sass.teame.controller;

import java.net.URI;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.HttpHeaders;

import net.jalg.hawkj.Algorithm;
import net.jalg.hawkj.AuthorizationHeader;
import net.jalg.hawkj.HawkContext;

public class AuthProcessor {

	public static boolean Authenticate(HttpServletRequest requestContext, String password,String userId) {
		try {
			AuthorizationHeader authHeader = AuthorizationHeader.authorization(
			         requestContext.getHeader(HttpHeaders.AUTHORIZATION));
			
			URI uri = new URI(requestContext.getRequestURI());
			HawkContext hawk = HawkContext.request(requestContext.getMethod(), uri.getPath(),
			                                       uri.getHost(), uri.getPort())
			                     .credentials(userId, password, Algorithm.SHA_256)
			                     .tsAndNonce(authHeader.getTs(), authHeader.getNonce())
			                     .hash(authHeader.getHash()).build();
			
			
			if (hawk.isValidMac(authHeader.getMac())) {
			      return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
	}
	
}
