package dk.itu.sass.teame.boundary;

import javax.inject.Inject;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import dk.itu.sass.teame.controller.AccountController;

@Path("account")
@Produces(MediaType.APPLICATION_JSON)
public class AccountResource {
	
	@Inject
    private AccountController accountController;
	//private AccountController accController = new AccountController();
	
	@GET
	@Path("hello")
	public Response helloUser(){
		System.out.println("hello user called");
		return Response.ok().entity("success").build();
	}

	@POST
	@Path("create")
	public Response createUser(
			@FormParam("username") String username,
			@FormParam("password") String password,
			@FormParam("email") String email
			) {
		
		if(username == null || password == null){
			return Response.status(Response.Status.BAD_REQUEST).build();
		}
		
		String foundUser = accountController.validateUsername(username);
		
		if(!foundUser.isEmpty())
			return Response.status(Response.Status.PAYMENT_REQUIRED).entity(foundUser).build();
	
		long result = accountController.insertAccount(username, password, email).getAccountid();

		return Response.status(Response.Status.ACCEPTED).entity(result).build();
	}

}
