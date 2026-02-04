export function buildContactsClipboardText(contacts) {
	 const emails = [...new Set(contacts.map(c => c.email).filter(Boolean))];
	 const phones = [...new Set(contacts.map(c => c.phone).filter(Boolean))];
	 let txt = "";
	 if (emails.length) {
		    txt += `Emails:\n- ${emails.join("\n- ")}\n\n`;
		  }
	 if (phones.length) {
		    txt += `Phones:\n- ${phones.join("\n- ")}`;
		  }
	 return txt.trim();
}
