﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ServiceReferenceLDAP
{
    using System.Runtime.Serialization;
    
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.Tools.ServiceModel.Svcutil", "2.0.2")]
    [System.Runtime.Serialization.DataContractAttribute(Name="Persona", Namespace="http://schemas.datacontract.org/2004/07/Wcfwscurn")]
    public partial class Persona : object
    {
        
        private string Apel2_persField;
        
        private string Apel_persField;
        
        private string CiudadField;
        
        private string ClaveField;
        
        private string Codi_progField;
        
        private string CodigoField;
        
        private string DireccionField;
        
        private string DniField;
        
        private string DominioField;
        
        private string EmailField;
        
        private string EmailaltField;
        
        private string EstadoField;
        
        private string Msg_infoField;
        
        private string Nomb_progField;
        
        private string NombresField;
        
        private string RfidField;
        
        private string TelefonoField;
        
        private string Tipo_dniField;
        
        private string UsuarioField;
        
        private string VenceField;
        
        private string Vence1Field;
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Apel2_pers
        {
            get
            {
                return this.Apel2_persField;
            }
            set
            {
                this.Apel2_persField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Apel_pers
        {
            get
            {
                return this.Apel_persField;
            }
            set
            {
                this.Apel_persField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Ciudad
        {
            get
            {
                return this.CiudadField;
            }
            set
            {
                this.CiudadField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Clave
        {
            get
            {
                return this.ClaveField;
            }
            set
            {
                this.ClaveField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Codi_prog
        {
            get
            {
                return this.Codi_progField;
            }
            set
            {
                this.Codi_progField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Codigo
        {
            get
            {
                return this.CodigoField;
            }
            set
            {
                this.CodigoField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Direccion
        {
            get
            {
                return this.DireccionField;
            }
            set
            {
                this.DireccionField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Dni
        {
            get
            {
                return this.DniField;
            }
            set
            {
                this.DniField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Dominio
        {
            get
            {
                return this.DominioField;
            }
            set
            {
                this.DominioField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Email
        {
            get
            {
                return this.EmailField;
            }
            set
            {
                this.EmailField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Emailalt
        {
            get
            {
                return this.EmailaltField;
            }
            set
            {
                this.EmailaltField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Estado
        {
            get
            {
                return this.EstadoField;
            }
            set
            {
                this.EstadoField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Msg_info
        {
            get
            {
                return this.Msg_infoField;
            }
            set
            {
                this.Msg_infoField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Nomb_prog
        {
            get
            {
                return this.Nomb_progField;
            }
            set
            {
                this.Nomb_progField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Nombres
        {
            get
            {
                return this.NombresField;
            }
            set
            {
                this.NombresField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Rfid
        {
            get
            {
                return this.RfidField;
            }
            set
            {
                this.RfidField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Telefono
        {
            get
            {
                return this.TelefonoField;
            }
            set
            {
                this.TelefonoField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Tipo_dni
        {
            get
            {
                return this.Tipo_dniField;
            }
            set
            {
                this.Tipo_dniField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Usuario
        {
            get
            {
                return this.UsuarioField;
            }
            set
            {
                this.UsuarioField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Vence
        {
            get
            {
                return this.VenceField;
            }
            set
            {
                this.VenceField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Vence1
        {
            get
            {
                return this.Vence1Field;
            }
            set
            {
                this.Vence1Field = value;
            }
        }
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.Tools.ServiceModel.Svcutil", "2.0.2")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="ServiceReferenceLDAP.IServiceLDAP")]
    public interface IServiceLDAP
    {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/BuscarUID", ReplyAction="http://tempuri.org/IServiceLDAP/BuscarUIDResponse")]
        System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> BuscarUIDAsync(string usuario, string cn);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/AutenticarPersona", ReplyAction="http://tempuri.org/IServiceLDAP/AutenticarPersonaResponse")]
        System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> AutenticarPersonaAsync(string direccion, string usuario, string clave);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/AutenticarAcademicos", ReplyAction="http://tempuri.org/IServiceLDAP/AutenticarAcademicosResponse")]
        System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> AutenticarAcademicosAsync(string direccion, string usuario, string clave);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/BuscarEmployeeNumber", ReplyAction="http://tempuri.org/IServiceLDAP/BuscarEmployeeNumberResponse")]
        System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> BuscarEmployeeNumberAsync(string dni, string dc);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/valAprovicionCuenta", ReplyAction="http://tempuri.org/IServiceLDAP/valAprovicionCuentaResponse")]
        System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> valAprovicionCuentaAsync(string dni, string tipo);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/AddAccount", ReplyAction="http://tempuri.org/IServiceLDAP/AddAccountResponse")]
        System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> AddAccountAsync(string dni, string mailalt, string telefono, string tipo, string pathdocente);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/EditAccount", ReplyAction="http://tempuri.org/IServiceLDAP/EditAccountResponse")]
        System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> EditAccountAsync(string uid, string[] propiedad, string[] valor);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/deleteAccount", ReplyAction="http://tempuri.org/IServiceLDAP/deleteAccountResponse")]
        System.Threading.Tasks.Task<string> deleteAccountAsync(string cn, string token);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/moverEntry", ReplyAction="http://tempuri.org/IServiceLDAP/moverEntryResponse")]
        System.Threading.Tasks.Task<string> moverEntryAsync(string cn, string cndest);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/sendCorreo", ReplyAction="http://tempuri.org/IServiceLDAP/sendCorreoResponse")]
        System.Threading.Tasks.Task<string> sendCorreoAsync(string correo, string asunto, string mensaje);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/getPermiso", ReplyAction="http://tempuri.org/IServiceLDAP/getPermisoResponse")]
        System.Threading.Tasks.Task<string> getPermisoAsync(string bd);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/setAutorizacion", ReplyAction="http://tempuri.org/IServiceLDAP/setAutorizacionResponse")]
        System.Threading.Tasks.Task<string> setAutorizacionAsync(string bd, string usuario, string source, string ip);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/resetPassword", ReplyAction="http://tempuri.org/IServiceLDAP/resetPasswordResponse")]
        System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> resetPasswordAsync(string uid, string newpwd);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/getEmailAlt", ReplyAction="http://tempuri.org/IServiceLDAP/getEmailAltResponse")]
        System.Threading.Tasks.Task<bool> getEmailAltAsync(string uid, string emailalt);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/getTelephone", ReplyAction="http://tempuri.org/IServiceLDAP/getTelephoneResponse")]
        System.Threading.Tasks.Task<bool> getTelephoneAsync(string uid, string tele);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/EditAccount2", ReplyAction="http://tempuri.org/IServiceLDAP/EditAccount2Response")]
        System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> EditAccount2Async(string dni, string propiedad, string valor);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/BuscarEmailAlt", ReplyAction="http://tempuri.org/IServiceLDAP/BuscarEmailAltResponse")]
        System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> BuscarEmailAltAsync(string uid);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/BuscarTelephone", ReplyAction="http://tempuri.org/IServiceLDAP/BuscarTelephoneResponse")]
        System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> BuscarTelephoneAsync(string uid);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/EditAccount3", ReplyAction="http://tempuri.org/IServiceLDAP/EditAccount3Response")]
        System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> EditAccount3Async(string uid, string propiedad, string valor);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/EditAccount4", ReplyAction="http://tempuri.org/IServiceLDAP/EditAccount4Response")]
        System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> EditAccount4Async(string cn, string propiedad, string valor);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/generarPwd", ReplyAction="http://tempuri.org/IServiceLDAP/generarPwdResponse")]
        System.Threading.Tasks.Task<string> generarPwdAsync();
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/SendSMS", ReplyAction="http://tempuri.org/IServiceLDAP/SendSMSResponse")]
        System.Threading.Tasks.Task<string> SendSMSAsync(string telefono, string mensaje);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IServiceLDAP/AddAccountAxis", ReplyAction="http://tempuri.org/IServiceLDAP/AddAccountAxisResponse")]
        System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> AddAccountAxisAsync(
                    string dominio, 
                    string rama, 
                    string nombres, 
                    string apellido1, 
                    string apellido2, 
                    string usuario, 
                    string passw, 
                    string mail, 
                    string dni, 
                    string tipo_dni, 
                    string dpto, 
                    string vence, 
                    string programa, 
                    string rfid, 
                    string codnum, 
                    string estado, 
                    string telefono, 
                    string mailalt);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.Tools.ServiceModel.Svcutil", "2.0.2")]
    public interface IServiceLDAPChannel : ServiceReferenceLDAP.IServiceLDAP, System.ServiceModel.IClientChannel
    {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.Tools.ServiceModel.Svcutil", "2.0.2")]
    public partial class ServiceLDAPClient : System.ServiceModel.ClientBase<ServiceReferenceLDAP.IServiceLDAP>, ServiceReferenceLDAP.IServiceLDAP
    {
        
        /// <summary>
        /// Implement this partial method to configure the service endpoint.
        /// </summary>
        /// <param name="serviceEndpoint">The endpoint to configure</param>
        /// <param name="clientCredentials">The client credentials</param>
        static partial void ConfigureEndpoint(System.ServiceModel.Description.ServiceEndpoint serviceEndpoint, System.ServiceModel.Description.ClientCredentials clientCredentials);
        
        public ServiceLDAPClient(EndpointConfiguration endpointConfiguration) : 
                base(ServiceLDAPClient.GetBindingForEndpoint(endpointConfiguration), ServiceLDAPClient.GetEndpointAddress(endpointConfiguration))
        {
            this.Endpoint.Name = endpointConfiguration.ToString();
            ConfigureEndpoint(this.Endpoint, this.ClientCredentials);
        }
        
        public ServiceLDAPClient(EndpointConfiguration endpointConfiguration, string remoteAddress) : 
                base(ServiceLDAPClient.GetBindingForEndpoint(endpointConfiguration), new System.ServiceModel.EndpointAddress(remoteAddress))
        {
            this.Endpoint.Name = endpointConfiguration.ToString();
            ConfigureEndpoint(this.Endpoint, this.ClientCredentials);
        }
        
        public ServiceLDAPClient(EndpointConfiguration endpointConfiguration, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(ServiceLDAPClient.GetBindingForEndpoint(endpointConfiguration), remoteAddress)
        {
            this.Endpoint.Name = endpointConfiguration.ToString();
            ConfigureEndpoint(this.Endpoint, this.ClientCredentials);
        }
        
        public ServiceLDAPClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress)
        {
        }
        
        public System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> BuscarUIDAsync(string usuario, string cn)
        {
            return base.Channel.BuscarUIDAsync(usuario, cn);
        }
        
        public System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> AutenticarPersonaAsync(string direccion, string usuario, string clave)
        {
            return base.Channel.AutenticarPersonaAsync(direccion, usuario, clave);
        }
        
        public System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> AutenticarAcademicosAsync(string direccion, string usuario, string clave)
        {
            return base.Channel.AutenticarAcademicosAsync(direccion, usuario, clave);
        }
        
        public System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> BuscarEmployeeNumberAsync(string dni, string dc)
        {
            return base.Channel.BuscarEmployeeNumberAsync(dni, dc);
        }
        
        public System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> valAprovicionCuentaAsync(string dni, string tipo)
        {
            return base.Channel.valAprovicionCuentaAsync(dni, tipo);
        }
        
        public System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> AddAccountAsync(string dni, string mailalt, string telefono, string tipo, string pathdocente)
        {
            return base.Channel.AddAccountAsync(dni, mailalt, telefono, tipo, pathdocente);
        }
        
        public System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> EditAccountAsync(string uid, string[] propiedad, string[] valor)
        {
            return base.Channel.EditAccountAsync(uid, propiedad, valor);
        }
        
        public System.Threading.Tasks.Task<string> deleteAccountAsync(string cn, string token)
        {
            return base.Channel.deleteAccountAsync(cn, token);
        }
        
        public System.Threading.Tasks.Task<string> moverEntryAsync(string cn, string cndest)
        {
            return base.Channel.moverEntryAsync(cn, cndest);
        }
        
        public System.Threading.Tasks.Task<string> sendCorreoAsync(string correo, string asunto, string mensaje)
        {
            return base.Channel.sendCorreoAsync(correo, asunto, mensaje);
        }
        
        public System.Threading.Tasks.Task<string> getPermisoAsync(string bd)
        {
            return base.Channel.getPermisoAsync(bd);
        }
        
        public System.Threading.Tasks.Task<string> setAutorizacionAsync(string bd, string usuario, string source, string ip)
        {
            return base.Channel.setAutorizacionAsync(bd, usuario, source, ip);
        }
        
        public System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> resetPasswordAsync(string uid, string newpwd)
        {
            return base.Channel.resetPasswordAsync(uid, newpwd);
        }
        
        public System.Threading.Tasks.Task<bool> getEmailAltAsync(string uid, string emailalt)
        {
            return base.Channel.getEmailAltAsync(uid, emailalt);
        }
        
        public System.Threading.Tasks.Task<bool> getTelephoneAsync(string uid, string tele)
        {
            return base.Channel.getTelephoneAsync(uid, tele);
        }
        
        public System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> EditAccount2Async(string dni, string propiedad, string valor)
        {
            return base.Channel.EditAccount2Async(dni, propiedad, valor);
        }
        
        public System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> BuscarEmailAltAsync(string uid)
        {
            return base.Channel.BuscarEmailAltAsync(uid);
        }
        
        public System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> BuscarTelephoneAsync(string uid)
        {
            return base.Channel.BuscarTelephoneAsync(uid);
        }
        
        public System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> EditAccount3Async(string uid, string propiedad, string valor)
        {
            return base.Channel.EditAccount3Async(uid, propiedad, valor);
        }
        
        public System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> EditAccount4Async(string cn, string propiedad, string valor)
        {
            return base.Channel.EditAccount4Async(cn, propiedad, valor);
        }
        
        public System.Threading.Tasks.Task<string> generarPwdAsync()
        {
            return base.Channel.generarPwdAsync();
        }
        
        public System.Threading.Tasks.Task<string> SendSMSAsync(string telefono, string mensaje)
        {
            return base.Channel.SendSMSAsync(telefono, mensaje);
        }
        
        public System.Threading.Tasks.Task<ServiceReferenceLDAP.Persona> AddAccountAxisAsync(
                    string dominio, 
                    string rama, 
                    string nombres, 
                    string apellido1, 
                    string apellido2, 
                    string usuario, 
                    string passw, 
                    string mail, 
                    string dni, 
                    string tipo_dni, 
                    string dpto, 
                    string vence, 
                    string programa, 
                    string rfid, 
                    string codnum, 
                    string estado, 
                    string telefono, 
                    string mailalt)
        {
            return base.Channel.AddAccountAxisAsync(dominio, rama, nombres, apellido1, apellido2, usuario, passw, mail, dni, tipo_dni, dpto, vence, programa, rfid, codnum, estado, telefono, mailalt);
        }
        
        public virtual System.Threading.Tasks.Task OpenAsync()
        {
            return System.Threading.Tasks.Task.Factory.FromAsync(((System.ServiceModel.ICommunicationObject)(this)).BeginOpen(null, null), new System.Action<System.IAsyncResult>(((System.ServiceModel.ICommunicationObject)(this)).EndOpen));
        }
        
        public virtual System.Threading.Tasks.Task CloseAsync()
        {
            return System.Threading.Tasks.Task.Factory.FromAsync(((System.ServiceModel.ICommunicationObject)(this)).BeginClose(null, null), new System.Action<System.IAsyncResult>(((System.ServiceModel.ICommunicationObject)(this)).EndClose));
        }
        
        private static System.ServiceModel.Channels.Binding GetBindingForEndpoint(EndpointConfiguration endpointConfiguration)
        {
            if ((endpointConfiguration == EndpointConfiguration.BasicHttpBinding_IServiceLDAP))
            {
                System.ServiceModel.BasicHttpBinding result = new System.ServiceModel.BasicHttpBinding();
                result.MaxBufferSize = int.MaxValue;
                result.ReaderQuotas = System.Xml.XmlDictionaryReaderQuotas.Max;
                result.MaxReceivedMessageSize = int.MaxValue;
                result.AllowCookies = true;
                return result;
            }
            if ((endpointConfiguration == EndpointConfiguration.BasicHttpsBinding_IServiceLDAP))
            {
                System.ServiceModel.BasicHttpBinding result = new System.ServiceModel.BasicHttpBinding();
                result.MaxBufferSize = int.MaxValue;
                result.ReaderQuotas = System.Xml.XmlDictionaryReaderQuotas.Max;
                result.MaxReceivedMessageSize = int.MaxValue;
                result.AllowCookies = true;
                result.Security.Mode = System.ServiceModel.BasicHttpSecurityMode.Transport;
                return result;
            }
            throw new System.InvalidOperationException(string.Format("Could not find endpoint with name \'{0}\'.", endpointConfiguration));
        }
        
        private static System.ServiceModel.EndpointAddress GetEndpointAddress(EndpointConfiguration endpointConfiguration)
        {
            if ((endpointConfiguration == EndpointConfiguration.BasicHttpBinding_IServiceLDAP))
            {
                return new System.ServiceModel.EndpointAddress("http://ec2amaz-3eao0ea/wsldap/ServiceLDAP.svc");
            }
            if ((endpointConfiguration == EndpointConfiguration.BasicHttpsBinding_IServiceLDAP))
            {
                return new System.ServiceModel.EndpointAddress("https://axis.curn.edu.co/wsldap/ServiceLDAP.svc");
            }
            throw new System.InvalidOperationException(string.Format("Could not find endpoint with name \'{0}\'.", endpointConfiguration));
        }
        
        public enum EndpointConfiguration
        {
            
            BasicHttpBinding_IServiceLDAP,
            
            BasicHttpsBinding_IServiceLDAP,
        }
    }
}