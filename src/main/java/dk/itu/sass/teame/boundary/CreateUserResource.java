package dk.itu.sass.teame.boundary;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import dk.itu.sass.teame.controller.CreateUserController;


@Path("createuser")
@Produces(MediaType.APPLICATION_JSON)
public class CreateUserResource {
	
	@Inject
    private CreateUserController createUserController;
	
	@GET
	@Path("hello")
	public Response helloUser(){
		System.out.println("hello user called");
		return Response.ok().build();
	}

	@GET
	@Path("create")
	public Response createUser(
			@QueryParam("username") String username,
			@QueryParam("password") String password,
			@QueryParam("email") String email
			) {
	
		if(username == null || password == null){
			return Response.status(Response.Status.BAD_REQUEST).build();
		}
		String foundUser = createUserController.validateUsername(username);
		
		
		if(!foundUser.isEmpty())
			return Response.status(Response.Status.PAYMENT_REQUIRED).entity(foundUser).build();
	
		int result = createUserController.insertUser(username, password, email);
		
		return Response.status(Response.Status.ACCEPTED).entity(result).build();
	}

}
