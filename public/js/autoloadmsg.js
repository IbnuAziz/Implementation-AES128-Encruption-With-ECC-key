const api_message = 'http://localhost:3000/pesanmasuknotrender'
	getMessage()
	async function getMessage() {
		const response = await fetch(api_message);
		const data = await response.json();
		const rows = data.rows;

		if(rows.length){
			const masuk = rows.length;
			document.getElementById('masuk').textContent = masuk
		}else{
			document.getElementById('masuk').innerHTML = "No Message"
		}
	}
const inter = setInterval(getMessage, 5000)

setTimeout(() => {
	clearInterval(inter)
	console.log('stopped!')
}, 3600000);