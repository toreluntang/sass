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

import dk.itu.sass.teame.controller.AuthProcessor;

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
			System.out.println("authenticating..." + r);
			boolean isAuth = AuthProcessor.Authenticate(r);
			System.out.println("Has been authenticated..." + isAuth);

			if (isAuth) {
				chain.doFilter(request, response);
				return;
			}
			else {
				res.sendError(401);
			    return;
			}
		}

		jsonObject.addProperty(errKey, "Only HttpServletRequest is allowed");
		response.getWriter().write(jsonObject.toString());
		return;
	}

	@Override
	public void destroy() {
	}

	
	
}
