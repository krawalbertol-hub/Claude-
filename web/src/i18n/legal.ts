import type { Lang } from '../config/site';

// Plantillas legales. Sustituir los campos entre corchetes por los datos reales y revisarlas con un asesor.
// [TITULAR] = nombre y apellidos de los cofundadores o razón social; [NIF]; [DOMICILIO].
type Doc = { title: string; updated: string; sections: { h: string; p: string[] }[] };
type Docs = Record<'legal' | 'privacy' | 'cookies', Doc>;

const UPDATED_ES = 'Última actualización: [FECHA]';
const UPDATED_CA = 'Darrera actualització: [DATA]';

export const LEGAL: Record<Lang, Docs> = {
  es: {
    legal: {
      title: 'Aviso legal',
      updated: UPDATED_ES,
      sections: [
        { h: '1. Titular del sitio web', p: ['En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), se informa de que este sitio web es titularidad de [TITULAR], con NIF [NIF] y domicilio en [DOMICILIO], 17430 Santa Coloma de Farners (Girona), que opera bajo el nombre comercial ORBIXEL Agency.', 'Correo electrónico de contacto: contact.orbixel@gmail.com. Teléfono: [TELÉFONO].'] },
        { h: '2. Objeto', p: ['Este sitio web informa sobre los servicios de diagnóstico, consultoría e implementación tecnológica (automatizaciones, inteligencia artificial, CRM, webs y redes sociales) que presta ORBIXEL Agency.'] },
        { h: '3. Condiciones de uso', p: ['El acceso al sitio web es gratuito y atribuye la condición de usuario, que se compromete a hacer un uso adecuado de los contenidos y a no emplearlos para actividades ilícitas o contrarias a la buena fe.'] },
        { h: '4. Propiedad intelectual e industrial', p: ['La marca ORBIXEL, el logotipo, los textos, el diseño y el código de este sitio web son propiedad del titular o se usan con licencia. Queda prohibida su reproducción, distribución o transformación sin autorización expresa.'] },
        { h: '5. Responsabilidad', p: ['El titular no se hace responsable de los daños derivados de un uso indebido del sitio web ni de los contenidos de sitios de terceros enlazados desde él.'] },
        { h: '6. Legislación aplicable', p: ['Este aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la normativa vigente.'] },
      ],
    },
    privacy: {
      title: 'Política de privacidad',
      updated: UPDATED_ES,
      sections: [
        { h: '1. Responsable del tratamiento', p: ['[TITULAR] (ORBIXEL Agency), NIF [NIF], [DOMICILIO], 17430 Santa Coloma de Farners (Girona). Correo: contact.orbixel@gmail.com.'] },
        { h: '2. Qué datos tratamos', p: ['Los datos que nos facilitas en el formulario de contacto, por WhatsApp o por correo: nombre, negocio, sector, email o teléfono y el contenido de tu mensaje.'] },
        { h: '3. Finalidades y base legal', p: ['Responder a tu solicitud y preparar el diagnóstico (base legal: tu consentimiento y la aplicación de medidas precontractuales, art. 6.1.a y 6.1.b RGPD).', 'Enviarte comunicaciones comerciales, solo si marcas la casilla correspondiente (base legal: consentimiento, art. 6.1.a RGPD y art. 21 LSSI-CE). Puedes retirarlo en cualquier momento.'] },
        { h: '4. Conservación', p: ['Conservamos los datos mientras sean necesarios para atender tu solicitud y, si llegamos a trabajar juntos, durante la relación y los plazos legales aplicables. Los datos para comunicaciones comerciales se conservan hasta que retires el consentimiento.'] },
        { h: '5. Destinatarios', p: ['No cedemos tus datos a terceros salvo obligación legal. Podemos usar proveedores que actúan como encargados del tratamiento (alojamiento web, gestión de formularios, correo electrónico), con los que tenemos firmados los contratos exigidos por el RGPD: [LISTA DE PROVEEDORES].'] },
        { h: '6. Tus derechos', p: ['Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a contact.orbixel@gmail.com. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) o la Autoritat Catalana de Protecció de Dades (apdcat.gencat.cat).'] },
        { h: '7. Seguridad', p: ['Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos, siguiendo el principio de privacidad desde el diseño y por defecto.'] },
      ],
    },
    cookies: {
      title: 'Política de cookies',
      updated: UPDATED_ES,
      sections: [
        { h: '1. Qué son las cookies', p: ['Las cookies y tecnologías similares (como el almacenamiento local del navegador) guardan información en tu dispositivo cuando visitas una web.'] },
        { h: '2. Cookies que usamos', p: ['Técnicas (necesarias): guardan tu elección sobre cookies (orbixel-consent) y tu idioma (orbixel-lang). No requieren consentimiento.', 'Analítica (opcional): solo si aceptas, podríamos usar Google Analytics 4 para conocer de forma agregada cómo se usa la web. Mientras no aceptes, no se carga ningún script de analítica. [CONFIRMAR HERRAMIENTA DE ANALÍTICA]'] },
        { h: '3. Cómo cambiar tu elección', p: ['Puedes cambiar o retirar tu consentimiento en cualquier momento desde el enlace «Configurar cookies» del pie de página, o borrando las cookies desde la configuración de tu navegador.'] },
      ],
    },
  },
  ca: {
    legal: {
      title: 'Avís legal',
      updated: UPDATED_CA,
      sections: [
        { h: '1. Titular del lloc web', p: ["En compliment de la Llei 34/2002, de serveis de la societat de la informació i de comerç electrònic (LSSI-CE), s'informa que aquest lloc web és titularitat de [TITULAR], amb NIF [NIF] i domicili a [DOMICILI], 17430 Santa Coloma de Farners (Girona), que opera amb el nom comercial ORBIXEL Agency.", 'Correu electrònic de contacte: contact.orbixel@gmail.com. Telèfon: [TELÈFON].'] },
        { h: '2. Objecte', p: ["Aquest lloc web informa sobre els serveis de diagnòstic, consultoria i implementació tecnològica (automatitzacions, intel·ligència artificial, CRM, webs i xarxes socials) que presta ORBIXEL Agency."] },
        { h: "3. Condicions d'ús", p: ["L'accés al lloc web és gratuït i atribueix la condició d'usuari, que es compromet a fer un ús adequat dels continguts i a no emprar-los per a activitats il·lícites o contràries a la bona fe."] },
        { h: '4. Propietat intel·lectual i industrial', p: ["La marca ORBIXEL, el logotip, els textos, el disseny i el codi d'aquest lloc web són propietat del titular o s'utilitzen amb llicència. Se'n prohibeix la reproducció, distribució o transformació sense autorització expressa."] },
        { h: '5. Responsabilitat', p: ["El titular no es fa responsable dels danys derivats d'un ús indegut del lloc web ni dels continguts de llocs de tercers enllaçats des d'aquest."] },
        { h: '6. Legislació aplicable', p: ["Aquest avís legal es regeix per la legislació espanyola. Per a qualsevol controvèrsia, les parts se sotmeten als jutjats i tribunals que corresponguin d'acord amb la normativa vigent."] },
      ],
    },
    privacy: {
      title: 'Política de privacitat',
      updated: UPDATED_CA,
      sections: [
        { h: '1. Responsable del tractament', p: ['[TITULAR] (ORBIXEL Agency), NIF [NIF], [DOMICILI], 17430 Santa Coloma de Farners (Girona). Correu: contact.orbixel@gmail.com.'] },
        { h: '2. Quines dades tractem', p: ['Les dades que ens facilites al formulari de contacte, per WhatsApp o per correu: nom, negoci, sector, email o telèfon i el contingut del teu missatge.'] },
        { h: '3. Finalitats i base legal', p: ["Respondre la teva sol·licitud i preparar el diagnòstic (base legal: el teu consentiment i l'aplicació de mesures precontractuals, art. 6.1.a i 6.1.b RGPD).", "Enviar-te comunicacions comercials, només si marques la casella corresponent (base legal: consentiment, art. 6.1.a RGPD i art. 21 LSSI-CE). El pots retirar en qualsevol moment."] },
        { h: '4. Conservació', p: ["Conservem les dades mentre siguin necessàries per atendre la teva sol·licitud i, si arribem a treballar junts, durant la relació i els terminis legals aplicables. Les dades per a comunicacions comercials es conserven fins que retiris el consentiment."] },
        { h: '5. Destinataris', p: ["No cedim les teves dades a tercers excepte per obligació legal. Podem fer servir proveïdors que actuen com a encarregats del tractament (allotjament web, gestió de formularis, correu electrònic), amb els quals tenim signats els contractes exigits pel RGPD: [LLISTA DE PROVEÏDORS]."] },
        { h: '6. Els teus drets', p: ["Pots exercir els drets d'accés, rectificació, supressió, oposició, limitació del tractament i portabilitat escrivint a contact.orbixel@gmail.com. També pots presentar una reclamació davant l'Autoritat Catalana de Protecció de Dades (apdcat.gencat.cat) o l'Agencia Española de Protección de Datos (www.aepd.es)."] },
        { h: '7. Seguretat', p: ['Apliquem mesures tècniques i organitzatives adequades per protegir les teves dades, seguint el principi de privacitat des del disseny i per defecte.'] },
      ],
    },
    cookies: {
      title: 'Política de galetes',
      updated: UPDATED_CA,
      sections: [
        { h: '1. Què són les galetes', p: ["Les galetes i tecnologies similars (com l'emmagatzematge local del navegador) guarden informació al teu dispositiu quan visites un web."] },
        { h: '2. Galetes que fem servir', p: ['Tècniques (necessàries): guarden la teva elecció sobre galetes (orbixel-consent) i el teu idioma (orbixel-lang). No requereixen consentiment.', "Analítica (opcional): només si acceptes, podríem fer servir Google Analytics 4 per conèixer de manera agregada com s'utilitza el web. Mentre no acceptis, no es carrega cap script d'analítica. [CONFIRMAR EINA D'ANALÍTICA]"] },
        { h: '3. Com canviar la teva elecció', p: ["Pots canviar o retirar el teu consentiment en qualsevol moment des de l'enllaç «Configura les galetes» del peu de pàgina, o esborrant les galetes des de la configuració del navegador."] },
      ],
    },
  },
};
