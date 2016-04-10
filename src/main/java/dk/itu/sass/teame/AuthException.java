package dk.itu.sass.teame;

import javax.servlet.ServletException;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class AuthException implements ExceptionMapper<ServletException> {

	@Override
	public Response toResponse(ServletException exception) {
		
		String s = "Fuck you2";
		
		if(exception != null)
			s = s + exception.toString();
		
		return Response.status(401).entity(s).build();
	}

	
	
}
