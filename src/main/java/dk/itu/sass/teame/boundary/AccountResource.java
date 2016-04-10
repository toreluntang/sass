package dk.itu.sass.teame.boundary;

import javax.inject.Inject;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.google.gson.JsonObject;

import dk.itu.sass.teame.controller.AccountController;
import dk.itu.sass.teame.entity.Account;
import net.jalg.hawkj.Algorithm;
import net.jalg.hawkj.AuthorizationHeader;
import net.jalg.hawkj.HawkContext;
import net.jalg.hawkj.HawkContext.HawkContextBuilder;
import net.jalg.hawkj.HawkContext.HawkContextBuilder_B;

@Path("account")
@Produces(MediaType.APPLICATION_JSON)
public class AccountResource {
	
	@Inject
    private AccountController accountController;
	//private AccountController accController = new AccountController();

	@POST
	@Path("create")
	public Response createAccount(
			@FormParam("username") String username,
			@FormParam("password") String password,
			@FormParam("email") String email
			)
	{
		
		if(username == null || password == null || email == null){
			return Response.status(Response.Status.BAD_REQUEST).build();
		}
		
		boolean usernameIsTaken = accountController.validateUsername(username);
		
		if(!usernameIsTaken)
			return Response.status(Response.Status.PAYMENT_REQUIRED).build();
	
		long result = accountController.insertAccount(username, password, email).getAccountid();

		return Response.status(Response.Status.ACCEPTED).entity(result).build();
	}
	
	@POST
	@Path("login")
	public Response login(@FormParam("username") String username, @FormParam("password") String password) {
		
		JsonObject json = new JsonObject();
		
		Account account = accountController.login(username, password);
		
		if(account==null)
			return Response.status(Status.UNAUTHORIZED).build();

		
		String method = "POST";
		String path = "login";
		String host = "localhost";
		int port = 8080;
		long ts = 123;
		String nonce = "piggybank";
		String id = account.getAccountid()+""; //Userid???
		String key = account.getPassword(); //Password?? SOMETHING ELSE
		Algorithm algorithm = Algorithm.SHA_256;
		String hash = HawkContextBuilder.generateHash(algorithm, "what body".getBytes(), "text/plain");
		String ext = "no one noes";
		String app = "app wtf";
		String dlg = "doed bjorn";
		long offset = 4l;
		
		//new HawkContext(method,path,host,port,ts,nonce,id,key,algorithm,hash,ext,app,dlg,offset);
		
		HawkContextBuilder_B b = HawkContext.request(method, path, host, port);
		HawkContext context = b.credentials(id, key, algorithm).build();
		AuthorizationHeader header = context.createAuthorizationHeader();
		
		
		json.addProperty("accountid", account.getAccountid());
		json.addProperty("username", account.getUsername());
		json.addProperty("email", account.getEmail());
		json.addProperty("password", account.getPassword());
		json.addProperty("salt", account.getSalt());
		
		JsonObject authHeader = new JsonObject();
		authHeader.addProperty("hash", header.getHash());
		authHeader.addProperty("mac", header.getMac());
		authHeader.addProperty("ts",	header.getTs());
		authHeader.addProperty("nonce", header.getNonce());
		
		json.add("Auth", authHeader);
		
		return Response.ok().entity(json.toString()).build();
	}

}
