package dk.itu.sass.teame;

import java.io.IOException;
import java.net.URI;
import java.util.Enumeration;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.jalg.hawkj.Algorithm;
import net.jalg.hawkj.AuthorizationHeader;
import net.jalg.hawkj.HawkContext;
import net.jalg.hawkj.HawkContext.HawkContextBuilder_B;

@WebFilter(urlPatterns = "/*")
public class AuthFilter implements Filter {

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		
		if (request instanceof HttpServletRequest) {
			HttpServletRequest r = (HttpServletRequest) request;
			HttpServletResponse res = (HttpServletResponse) response;
			
			String hmac = r.getHeader("mac");
			String accountId = r.getHeader("accountId");
			Long ts = null;
			try {
				ts = Long.parseLong(r.getHeader("ts"));
			}catch(Exception e) { 
				res.getWriter().write("Wrong ts");
				return;
			}
			String nonce = r.getHeader("nonce");
			String method = "POST";
			String path = "login";
			String host = "localhost";
			int port = 8080;
			String id = accountId; //Userid???
			String key = "car"; //Password?? SOMETHING ELSE
			Algorithm algorithm = Algorithm.SHA_256;
			
			HawkContext hawk = HawkContext.request(method, path,
			                                       host, port)
			                     .credentials(id, key, algorithm)
			                     .tsAndNonce(ts, nonce)
			                     .hash(null).build();

			/*
			 * Now we use the created Hawk to validate the HMAC sent by the client
			 * in the Authorization header.
			 */
			if (!hawk.isValidMac(hmac)) {
				res.getWriter().write("Nice try Script kiddie!");
			    return;
			}
			
			chain.doFilter(request, response);
			//res.getWriter().write("Wrong authentication");
			//return;
		}

		//chain.doFilter(request, response);
		response.getWriter().write("WTF happend there dude. To crazy - the club can't even handle me right naaaaw");
		return;
	}

	@Override
	public void destroy() {
	}

	
	
}
