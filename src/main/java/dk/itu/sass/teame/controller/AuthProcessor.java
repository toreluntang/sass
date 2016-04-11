package dk.itu.sass.teame.controller;

import java.net.URI;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.HttpHeaders;

import net.jalg.hawkj.Algorithm;
import net.jalg.hawkj.AuthHeaderParsingException;
import net.jalg.hawkj.AuthorizationHeader;
import net.jalg.hawkj.HawkContext;

public class AuthProcessor {

	public static boolean Authenticate(ContainerRequestContext requestContext, String password,String userId) {
		try {
			AuthorizationHeader authHeader = AuthorizationHeader.authorization(
			         requestContext.getHeaderString(HttpHeaders.AUTHORIZATION));
			
			URI uri = requestContext.getUriInfo().getRequestUri();
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
		} catch (AuthHeaderParsingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
	}
	
}
