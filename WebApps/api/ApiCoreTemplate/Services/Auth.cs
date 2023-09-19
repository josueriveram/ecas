using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ApiBienestar.Auxiliar;
using ApiBienestar.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace ApiBienestar.Services.Contracts
{
    public class Auth
    {
        public string GenerateToken(DateTime date, UserToken ut, TimeSpan validDate)
        {

            var Cfg = Startup.Configuration;
            var vissuer = Cfg["AuthenticationSettings:Issuer"];
            var vaudience = Cfg["AuthenticationSettings:Audience"];
            var vsigningKey = Cfg["AuthenticationSettings:SigningKey"];

            var expire = date.Add(validDate);
            var claim = new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,ut.Dni),
                new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
                new Claim(
                            JwtRegisteredClaimNames.Iat,
                            new DateTimeOffset(date).ToUniversalTime().ToUnixTimeSeconds().ToString(),
                            ClaimValueTypes.Integer64
                         ),
                new Claim("role",ut.Role), //ROLE ADMIN
                new Claim("usertype",ut.Type), //branch para obetner del ROLE PARTICIPANTES
                new Claim("nombprog",ut.NombProg),
                new Claim("codprog",ut.CodProg),
                new Claim("mail",ut.Mail),
                new Claim("codnum",ut.Codnum),
                new Claim("displayname",ut.DisplayName)
            };

            var signingCredentials = new Microsoft.IdentityModel.Tokens.SigningCredentials
                (
                    new SymmetricSecurityKey(Encoding.ASCII.GetBytes(vsigningKey)),
                    SecurityAlgorithms.HmacSha256Signature
                );

            var jwt = new JwtSecurityToken(

                issuer: vissuer,
                audience: vaudience,
                claims: claim,
                notBefore: date,
                expires: expire,
                signingCredentials: signingCredentials

                );


            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
            return encodedJwt;
        }

        public UserToken ObtenerDatosToken(string token)
        {
            UserToken ut = new UserToken();
            var Cfg = Startup.Configuration;
            var vissuer = Cfg["AuthenticationSettings:Issuer"];
            var vaudience = Cfg["AuthenticationSettings:Audience"];
            var vsigningKey = Cfg["AuthenticationSettings:SigningKey"];
            try
            {


                var tokenHandler = new JwtSecurityTokenHandler();

                var tokenr = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = vissuer,
                    ValidAudience = vaudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(vsigningKey))

                }, out SecurityToken validatedToken);
                List<Claim> claim = tokenr.Claims.ToList<Claim>();
                ut.Dni = claim[0].Value.ToString();
                ut.Type = claim[4].Value.ToString();
                ut.NombProg = claim[5].Value.ToString();
                ut.CodProg = claim[6].Value.ToString();
                ut.Mail = claim[7].Value.ToString();
                ut.Codnum = claim[8].Value.ToString();
                ut.DisplayName = claim[9].Value.ToString();
                ut.Role = claim[3].Value.ToString();
            }
            catch (Exception)
            {
            }
            return ut;
        }
        public bool ValidateToken(string token)
        {
            bool ret = true;
            var Cfg = Startup.Configuration;
            var vissuer = Cfg["AuthenticationSettings:Issuer"];
            var vaudience = Cfg["AuthenticationSettings:Audience"];
            var vsigningKey = Cfg["AuthenticationSettings:SigningKey"];
            try
            {


                var tokenHandler = new JwtSecurityTokenHandler();

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = vissuer,
                    ValidAudience = vaudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(vsigningKey))

                }, out SecurityToken validatedToken);
            }
            catch (Exception)
            {
                ret = false;
            }
            return ret;
        }
    }
}
