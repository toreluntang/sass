package dk.itu.sass.teame;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonObject;

import dk.itu.sass.teame.controller.AccountController;
import dk.itu.sass.teame.controller.AuthProcessor;
import dk.itu.sass.teame.entity.Account;
import net.jalg.hawkj.Algorithm;
import net.jalg.hawkj.HawkContext;

@WebFilter(urlPatterns = "/resources/protected/*")
public class AuthFilter implements Filter {

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		JsonObject jsonObject = new JsonObject();
		String errKey = "error";
		
		if (request instanceof HttpServletRequest) {
			HttpServletRequest r = (HttpServletRequest) request;
			HttpServletResponse res = (HttpServletResponse) response;
			long accountId = Long.parseLong(r.getHeader("accountId"));
			Account acc = AccountController.getAccountById(accountId);
			boolean isAuth = AuthProcessor.Authenticate(r, acc.getPassword(), acc.getUsername());
			if (!isAuth) {
				jsonObject.addProperty(errKey, "Nice try Script kiddie!");
				res.getWriter().write(jsonObject.toString());
			    return;
			}
//			String hmac = r.getHeader("mac");
//			Long ts = null;
//			try {
//				ts = Long.parseLong(r.getHeader("ts"));
//			}catch(Exception e) { 
//				jsonObject.addProperty(errKey, "Wrong ts format");
//				res.getWriter().write(jsonObject.toString());
//				return;
//			}
//			String nonce = r.getHeader("nonce");
//			String method = "POST";
//			String path = "login";
//			String host = "localhost";
//			int port = 8080;
//			String id = accountId; //Userid???
//			String key = "car"; //Password?? SOMETHING ELSE
//			Algorithm algorithm = Algorithm.SHA_256;
//			
//			HawkContext hawk = HawkContext.request(method, path,
//			                                       host, port)
//			                     .credentials(id, key, algorithm)
//			                     .tsAndNonce(ts, nonce)
//			                     .hash(null).build();
//
//			/*
//			 * Now we use the created Hawk to validate the HMAC sent by the client
//			 * in the Authorization header.
//			 */
//			if (!hawk.isValidMac(hmac)) {
//				jsonObject.addProperty(errKey, "Nice try Script kiddie!");
//				res.getWriter().write(jsonObject.toString());
//			    return;
//			}
			
			chain.doFilter(request, response);
			return;
		}

		jsonObject.addProperty(errKey, "Only HttpServletRequest is allowed");
		response.getWriter().write(jsonObject.toString());
		return;
	}

	@Override
	public void destroy() {
	}

	
	
}
