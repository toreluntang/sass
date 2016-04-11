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
		System.out.println("in auth filter");
		if (request instanceof HttpServletRequest) {
			HttpServletRequest r = (HttpServletRequest) request;
			HttpServletResponse res = (HttpServletResponse) response;
			
			boolean isAuth = AuthProcessor.Authenticate(r);
			
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
