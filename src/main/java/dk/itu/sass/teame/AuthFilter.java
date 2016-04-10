package dk.itu.sass.teame;

import java.io.IOException;
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

@WebFilter(urlPatterns = "/*")
public class AuthFilter implements Filter {

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		
		System.out.println("FILTER");
		
		System.out.println(request.getContentType());
		System.out.println(request.getServerPort());
		System.out.println(request.getServerName());
		System.out.println(request.getServletContext());
		
		if (request instanceof HttpServletRequest) {
			HttpServletRequest r = (HttpServletRequest) request;
			HttpServletResponse res = (HttpServletResponse) response;
			
			System.out.println(r.getHeader("mac"));
			
			Enumeration<String> heads = r.getHeaderNames();
			while(heads.hasMoreElements()) {
				String elem = heads.nextElement();
				System.out.println(elem + " : " + r.getHeader(elem));
			}
			
			//res.getWriter().write("Wrong authentication");
			//return;
		}

		System.out.println("FILTER END");
		
		chain.doFilter(request, response);
	}

	@Override
	public void destroy() {
	}

	
	
}
