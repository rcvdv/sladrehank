Sladrehank = function () {
	isOneCMP = () =>
		"__ucCmp" in window && __ucCmp.cmpController.coreData.cmp.version >= "3.30";
	getSettingsId = () =>
		window["__ucCmp"]
			? __ucCmp.cmpController.setting.id
			: window["UC_UI"]
			? UC_UI.getSettingsCore().id
			: undefined;
	autoBlockerConfiguration = () =>
		"__ucCmp" in window
			? `https://storage.googleapis.com/uc-${
					__ucCmp.cmpController.coreData.sandbox ? "dev" : "prod"
			  }-auto-blocker-config/${getSettingsId()}/${encodeURI(
					window.location.hostname
			  )}`
			: !1;
	splitAttribute = (e) => e.replaceAll(/\s+/g, "").split(",");
	useColor = (color) => `color:#${messageColor[color]};`;

	let cmpVersion = undefined,
		ucScriptAttributes = undefined;
	const domain = encodeURI(window.location.hostname),
		autoBlockerScript = document.querySelector(
			"script[src*='usercentrics.eu'][src*='autoblocker.js']"
		),
		autoBlockerSrc =
			/web\.cmp\.usercentrics(-sandbox)?\.eu\/modules\/autoblocker\.js/,
		autoBlockingEnabled = autoBlockerScript ? !0 : !1,
		blocked = blockedElementsPriorConsent(),
		bold = "font-size: 1rem;font-weight: 700",
		checkPrivacyProxy = document.querySelector(
			"meta[data-privacy-proxy-server]"
		),
		cmpVersions = [
			null,
			/app\.usercentrics\.eu\/[\d.a-z]+\/main\.js/,
			/app\.usercentrics\.eu\/browser-ui\/[\d.a-z]+\/(loader|bundle_legacy)\.js/,
			/web\.cmp\.usercentrics(-sandbox)?\.eu\/ui\/loader\.js/,
		],
		configLink = `https://v1.api.service.cmp.usercentrics.eu/latest/autoblocker/${getSettingsId()}?domain=${domain}`,
		issues = [],
		messageColor = { error: "EE0000", ok: "00CC00", warning: "FFA500" },
		smartDataProtector = checkSmartDataProtector(),
		tcfEnabled = "__tcfapi" in window,
		ucBrandColor = "#01A2FC",
		UsercentricsLogo =
			"url('data:image/jpeg;base64,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');" +
			"background-repeat: no-repeat; padding: 8px 110px;";

	this.ucCmpScript = identifyUcCmpScript();

	(function autoBlockingInstructions() {
		if (!autoBlockingEnabled || !isOneCMP()) return;
	})();

	(function checkEmbedValues(d) {
		const knownUcDataValues = [
			"all",
			"dataCollected",
			"dataProtectionOfficer",
			"dataPurposes",
			"dataRecipients",
			"description",
			"furtherInformation",
			"legalBasis",
			"optInCheckboxWithLabel",
			"processingLocation",
			"processorNames",
			"retentionPeriod",
			"technologiesUsed",
			"thirdCountryTransfer",
		];

		checkValidity = (what, elem, values) => {
			if (elem.hasAttribute(what)) {
				let a = splitAttribute(elem.getAttribute(what)),
					str = "";
				a.forEach((a) => {
					if (!values.includes(a)) str += `${str == "" ? "" : "\n"}  -${a}`;
				});

				if (str != "")
					issues.push(
						`Invalid ${what.toUpperCase()} values on: ${elem.outerHTML.match(
							/<div[^>]+>/
						)}\n${str}`
					);
			}
		};

		d.querySelectorAll("div.uc-embed").forEach((e) => {
			checkValidity("uc-data", e, knownUcDataValues);
			checkValidity("uc-embedding-type", e, [
				"all",
				"category",
				"category-all",
			]);
		});
		d.querySelectorAll("div.uc-embed-tcf").forEach((e) => {
			checkValidity("uc-embedding-type", e, ["purpose", "vendor"]);
		});
	})(document);

	function blockedElementsPriorConsent() {
		const blocked = [];
		for (let i of document.scripts)
			if (
				i.type === "text/plain" &&
				(i.hasAttribute("data-usercentrics") || i.hasAttribute("data-uc-hash"))
			)
				blocked.push(i.outerHTML);
		for (let i of document.getElementsByTagName("iframe"))
			if (!i.hasAttribute("src") && i.hasAttribute("data-uc-src"))
				blocked.push(i.outerHTML);
		return blocked;
	}

	(function checkAsyncAndDefer() {
		if (!autoBlockerScript || !isOneCMP()) return;
		if (autoBlockerScript.async)
			issues.push("The auto blocking script is loaded asynchronously.");
		if (autoBlockerScript.defer)
			issues.push("The auto blocking script is deferred.");
	})();

	(function checkUsercentricsScriptAttributes() {
		const knownAttributes = [
				"async",
				"data-disable-tracking",
				"data-language",
				"data-ruleset-id",
				"data-sandbox",
				"data-settings-id",
				"data-suppress-cmp-display",
				"data-tcf-enabled",
				"data-usercentrics",
				"data-version",
				"defer",
				"id",
				"nonce",
				"ruleset-id",
				"src",
				"type",
			],
			unknown = [];
		let str = "";
		for (let i in ucScriptAttributes)
			if (!knownAttributes.includes(i)) unknown.push(i);
		if (unknown.length > 0) {
			str = `The Usercentrics script has ${
				unknown.length
			} unrecognized attribute${unknown.length > 1 ? "s" : ""}:`;
			for (let i of unknown) str += `\n  - ${i}`;
		}
		if (str !== "") issues.push(str);
	})();

	function list(array, header) {
		const odd = ucBrandColor,
			even = "#CC977D";
		console.groupCollapsed(header);
		for (let i = 0; i < array.length; i++)
			console.info(`%c${array[i]}`, `color:${i % 2 ? even : odd}`);
		console.groupEnd();
	}

	function listDataProcessingServices() {
		if (!window["__ucCmp"] && !window["UC_UI"]) return;
		if (window["UC_UI"] && !window["__ucCmp"]) {
			console.groupCollapsed("Data Processing Services");
			UC_UI.getServicesBaseInfo().forEach(function (e) {
				console.info(
					`%c${e.name}`,
					`color:#${e.consent.status ? "00ff55" : "ff0055"};`
				);
			});
			console.groupEnd();
		}
		if (!window["__ucCmp"]) return;
		const services = __ucCmp.cmpController.dps.services;
		console.groupCollapsed("Data Processing Services");
		for (e in services) {
			console.info(
				`%c${services[e].name} %c→ ${services[e].category}`,
				`color:#${services[e].consent.given ? "00ff55" : "ff0055"};`,
				""
			);
		}
		console.groupEnd();
	}

	function listPotentialIssues() {
		if (issues.length > 0) {
			console.group(
				`%cThere ${issues.length > 1 ? "are" : "is"} ${
					issues.length
				} potential issue${issues.length > 1 ? "s" : ""}`,
				"font-size: .85rem"
			);
			for (let i of issues)
				console.info(`%c→%c ${i}`, `color: ${ucBrandColor}`, "");
			console.groupEnd();
		}
	}

	function checkSmartDataProtector() {
		if (!"uc" in window) return !1;
		for (let i of document.scripts)
			if (
				i.src &&
				/privacy-proxy\.usercentrics\.eu\/latest\/uc-block\.bundle\.js$/.test(
					i.src
				)
			)
				return i;
		return !1;
	}

	(function checkSmartDataProtectorIssues() {
		if (!smartDataProtector) return;
		if (smartDataProtector.hasAttribute("async"))
			issues.push("The Smart Data Protector script is loaded asynchronously.");
		if (smartDataProtector.hasAttribute("defer"))
			issues.push("The Smart Data Protector script is deferred.");
		if (smartDataProtector.type === "module")
			issues.push('The Smart Data Protector script has type="module".');
	})();

	function getUcScriptAttributes(e) {
		let scriptAttributes = "{";
		/[^ ][\w-]+=[\w"-]+[^>]+/g
			.exec(e.outerHTML)[0]
			.replaceAll('"', "")
			.split(" ")
			.forEach((e) => {
				scriptAttributes += `"${e.split("=")[0]}":"${e.split("=")[1]}",`;
			});

		scriptAttributes = scriptAttributes.replace(/,$/, "}");
		return JSON.parse(scriptAttributes);
	}

	function identifyUcCmpScript() {
		let cmpScript = undefined;
		document
			.querySelectorAll(
				"script[src*='usercentrics.eu'], script[src*='usercentrics-sandbox.eu']"
			)
			.forEach((e) => {
				if (
					cmpVersions[1].test(e.src) ||
					cmpVersions[2].test(e.src) ||
					cmpVersions[3].test(e.src)
				)
					cmpScript = e;
			});
		return cmpScript;
	}

	function printElementsBlockedPriorConsent() {
		if (blocked.length === 0)
			issues.push("No elements appear to be blocked prior consent.");
		if (blocked.length > 0)
			list(
				blocked,
				`${blocked.length} blocked element${blocked.length > 1 ? "s" : ""}`
			);
	}

	(function tcfEnabledThroughCmp() {
		if (!tcfEnabled) return;
		let enabledThroughCmp = false;
		switch (cmpVersion) {
			case 2:
				if (
					document
						.querySelector(
							"script[src$='app.usercentrics.eu/browser-ui/latest/loader.js']"
						)
						.hasAttribute("data-tcf-enabled")
				)
					enabledThroughCmp = true;
				break;
			case 3:
				if (
					document.querySelector(
						"script[src='https://web.cmp.usercentrics.eu/tcf/stub.js'"
					)
				)
					enabledThroughCmp = true;
				break;
			default:
				break;
		}
		if (!enabledThroughCmp)
			issues.push(
				"TCF is enabled, but not through the CMP. The CMP won't e bale to create a tcString."
			);
	})();

	confirm("Do you want to clear the console?") && console.clear();
	console.info("%c ", `background-image: ${UsercentricsLogo}`);
	if (this.ucCmpScript === null || this.ucCmpScript === undefined) {
		console.warn("No Usercentrics CMP script found");
		return;
	}

	/* CMP info */
	cmpVersion = cmpVersions[3].test(this.ucCmpScript["src"])
		? 3
		: cmpVersions[2].test(this.ucCmpScript["src"])
		? 2
		: cmpVersions[1].test(this.ucCmpScript["src"])
		? 1
		: false;
	ucScriptAttributes = getUcScriptAttributes(this.ucCmpScript);

	if (autoBlockerScript && !isOneCMP())
		issues.push(
			"Auto blocking script is implemented, but not supported in this version of Usercentrics CMP."
		);

	console.info(
		`%cUsercentrics Settings-ID: %c${getSettingsId()}\n%c` +
			`CMP Version ${cmpVersion}${isOneCMP() ? " ONE CMP" : ""}%c${
				smartDataProtector ? "\n  - Smart Data Protector enabled" : ""
			}${checkPrivacyProxy ? "\n  - Privacy Proxy enabled" : ""}${
				tcfEnabled ? "\n  - TCF enabled" : ""
			}\nAdmin interface: https://admin.usercentrics.eu/#/v2/configuration/setup?settingsId=${getSettingsId()}`,
		bold,
		`font-size: 1rem; color: ${ucBrandColor}`,
		bold,
		""
	);
	console.table(ucScriptAttributes);

	/* Auto blocker section */
	cmpVersion >= 3 &&
		isOneCMP() &&
		console.info(
			"%c" + "Auto blocking is %c%sABLED%c%s",
			"font-size: 1rem",
			`font-size: 1rem;${
				autoBlockingEnabled ? useColor("ok") : useColor("error")
			};`,
			autoBlockingEnabled ? "EN" : "DIS",
			"font-size: 1em",
			autoBlockingEnabled
				? `\nAuto blocking instructions: ${autoBlockerConfiguration()}`
				: ""
		);

	if ("UC_UI_SUPPRESS_CMP_DISPLAY" in window)
		issues.push("Banner supressed with %cUC_UI_SUPPRESS_CMP_DISPLAY=true");

	listDataProcessingServices();
	printElementsBlockedPriorConsent();

	(function checkLoadingSequence() {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState !== 4) return;
			if (this.status !== 200) return;

			var loadedBefore = 0,
				response = this.responseText,
				scripts = response.match(/<script[^>]*>/gms),
				ucIndex = -1;

			response = response.replaceAll(/<!--.*?-->/gms, "");

			for (let i = 0; i < scripts.length; i++) {
				if (autoBlockerSrc.test(scripts[i])) ucIndex = i;
				if (!/\.usercentrics\.eu\//.test(scripts[i]))
					if (i < ucIndex || ucIndex === -1) loadedBefore++;
			}
			if (autoBlockingEnabled && isOneCMP() && loadedBefore > 0 && ucIndex > -1)
				issues.push(
					`The Auto Blocking script is not implemented optimally, (${loadedBefore} script${
						loadedBefore > 1 ? "s" : ""
					} load${loadedBefore < 2 ? "s" : ""} before it).`
				);
			listPotentialIssues();
		};
		xhttp.open("GET", location.href, true);
		xhttp.send();
	})();
};
Sladrehank = new Sladrehank();
