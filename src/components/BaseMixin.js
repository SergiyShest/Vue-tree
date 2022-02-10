export const baseMixin = {

	methods: {

	ShowErrors(item) {
		var path = document.location.origin + "/Content/Sounds/bad-beep.mp3";
		console.log(path);
		var audio = new Audio(path);
		audio.autoplay = true;
		var stringError;
		item.Errors.forEach(x => {
			stringError += x.Name + ":";
			stringError += x.Errors.join("\r\n");

		});

		this.ShowAlert(stringError);
	}
	,
	CloseThis: function () {
		window.parent.postMessage("CloseUrlForm", '*'); //send message parent window for  close this form

	}
	,
		ShowAlert(message) {
			alert(message)
		}
		,
		//универсальная функция получения/отправки данных
		fetch: function (execFunction, pathEnd, data = null) {
			this.loadingData = true;
			var fetchRef = execFunction;
			var path = document.location.origin + pathEnd
			var json = JSON.stringify(data);
			fetch(path,
				{
					method: 'POST', // *GET, POST, PUT, DELETE, etc.
					mode: 'cors', // no-cors, *cors, same-origin
					body: json, //sending data
					headers: {
						'Content-Type': 'application/json'
					}
				})
				.then((response) => {
					if (response)
						return response.json();
				})
				.then((retData) => {
					fetchRef(retData);
					this.loadingData = false;
				}).catch(error => {
					this.ShowAlert("Error while getting server data: " + error);
					this.loadingData = false;
				});

		}
	}
}
