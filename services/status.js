const checkServiceStatus = async (service) => {

	const response = await fetch(`https://apistatus.watch/api/status/public/${service}`);

	if (!response.ok) {
		if (response.status == 404) {
			throw new Error('API not found, please verify service name.');

		} else {
			throw new Error('External response error, please try later.');

		}
	}

	const responseData = await response.json();

	const serviceInfo = {
		name: responseData.name,
		description: responseData.description,
		category: responseData.category,
		current_status: responseData.current_status,
		last_checked: responseData.last_checked
	}

	return serviceInfo;

};

module.exports = {
	checkServiceStatus,
}