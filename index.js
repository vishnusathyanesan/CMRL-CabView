let access_token = '';
let authReqData = {
  "url": "https://r2m-rsams.cmrl.in/auth/realms/cmrl-dev/protocol/openid-connect/token",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  "data": {
    "username": "kkm",
    "password": "sG3zI6qX0mS7rD5k",
    "client_id": "r2m",
    "client_secret": "50d337a4-7735-466e-b624-758697526c4b",
    "grant_type": "password"
  }
};

function getToken(callback) {
    $.ajax(authReqData).done(function (response) {
	  access_token = response.access_token;
      callback(access_token);
	});

}

function getChannelConfig(callback){
	var channelReqData = {
	  "url": "https://r2m-rsams.cmrl.in/rest/channeldefinition/channels/CMRL1",
	  "method": "GET",
	  "timeout": 0,
	  "headers": {
	  	"Content-Type": "application/x-www-form-urlencoded",
	    "Authorization": "Bearer "+access_token,
	    "Access-Control-Allow-Origin": "*"
	  },
	  	// type : 'GET',
	   //  dataType : 'json',
	   //  async: false,
	   //  url: 'configData.json',
	};

	$.ajax(channelReqData).done(function (response) {
	  callback(response);
	});
}
function getLiveData(callback){
	var liveReqData = {
	  "url": "https://r2m-rsams.cmrl.in/rest/channeldefinition/channels/CMRL1",
	  "method": "GET",
	  "timeout": 0,
	  "headers": {
	  	"Content-Type": "application/x-www-form-urlencoded",
	    "Authorization": "Bearer "+access_token,
	    "Access-Control-Allow-Origin": "*"
	  },
	  	// type : 'GET',
	   //  dataType : 'json',
	   //  async: false,
	   //  url: 'liveChannelData.json',
	};
	$.ajax(liveReqData).done(function (response) {
	  callback(response);
	});
}
function getUnitsData(callback){
	var unitsRequestData = {
	  "url": "https://r2m-rsams.cmrl.in/rest/channeldefinition/channels/CMRL1",
	  "method": "GET",
	  "timeout": 0,
	  "headers": {
	  	"Content-Type": "application/x-www-form-urlencoded",
	    "Authorization": "Bearer "+access_token,
	    "Access-Control-Allow-Origin": "*"
	  },
	  	// type : 'GET',
	   //  dataType : 'json',
	   //  async: false,
	   //  url: 'allUnits.json',
	};
	$.ajax(unitsRequestData).done(function (response) {
	  callback(response);
	});
}

function drawSpeedInfo(configData,channels,unit){
	let speedInfo = {}
	let EVR_ISpeed = channels[_.where(configData, {"name": "EVR_ISpeed"})[0].shortName][0];
	let LI_NModeATORly_DMC1 = channels[_.where(configData, {"name": "LI_NModeATORly_DMC1"})[0].shortName][0];
	let LI_WashModeTL_DMC1 = channels[_.where(configData, {"name": "LI_WashModeTL_DMC1"})[0].shortName][0];
	let LI_FwdTL_DMC1 = channels[_.where(configData, {"name": "LI_FwdTL_DMC1"})[0].shortName][0];
	let LI_RevTL_DMC1 = channels[_.where(configData, {"name": "LI_RevTL_DMC1"})[0].shortName][0];
	let LI_FwdIsolTL_DMC1 = channels[_.where(configData, {"name": "LI_FwdIsolTL_DMC1"})[0].shortName][0];
	let cvDriving = '';
	let operatingMode = '';

	
	
	if(LI_NModeATORly_DMC1){
		cvDriving = 'Standby';
	}
	else if(LI_WashModeTL_DMC1){
		cvDriving = 'Wash';
	}
	else if(LI_FwdTL_DMC1){
		cvDriving = 'Forward';
	}
	else if(LI_RevTL_DMC1){
		cvDriving = 'Reverse';
	}
	
	if(LI_NModeATORly_DMC1){
		operatingMode = "ATO";
	}
	else if(LI_FwdIsolTL_DMC1){
		operatingMode = 'Isolated Manual';
	}
	else if(!LI_FwdIsolTL_DMC1 && LI_NModeATORly_DMC1){
		operatingMode = 'Manual with ATP';
	}

	$('#cvCurrentSpeed').html(parseFloat(EVR_ISpeed).toFixed(2));
	$('#cvDriving').html(cvDriving);
	$('#cvOperationMode').html(operatingMode);
	
}

function drawDoorStates(configData,channels,unit){
	console.log(unit);
	let doorHtml = '';
	let vehicles = unit.vehicles;//['DMC1','DMC2','TC1','TC2'];
	let LI_CabDrsOpn_DMC1 =channels[_.where(configData, {"name": 'LI_CabDrsOpn_DMC1'})[0].shortName][0];
	let LI_CabDrsOpn_DMC2 =channels[_.where(configData, {"name": 'LI_CabDrsOpn_DMC2'})[0].shortName][0];
	
	if(LI_CabDrsOpn_DMC1 || LI_CabDrsOpn_DMC2){
		$('.cv-cabin-door-state').html('<img src="PNG/Cabin_Door_state/at_lease_one_cabin_doors_open_1.png" alt="door_image" />');
	}
	let car = 0;
	vehicles.map(function(obj){
		car +=1;
		doorHtml += '<div class="col-3 cv-cabin"><div class="row">';
		for (let i = 1; i <= 8; i++) {
			let platformDoorState = '';
			doorHtml +='<div class="col-3">';
			console.log('TCCU'+(i <= 4 ? 1 : 2)+'_IPSD'+i+'Car'+car+'OK');
			let position = 'cv-top';
			let temp = i <= 4 ? 1 : 2;
			let TCCU_IPSDCarOk = channels[_.where(configData, {"name": 'TCCU'+temp+'_IPSD'+i+'Car'+car+'Ok'})[0].shortName][0];
			if(temp ==2){
				position = 'cv-bottom'
			}
			if(TCCU_IPSDCarOk){
				platformDoorState = '<span class="cv-platform-door-ok '+position+'"></span>';
			}
			else if(!TCCU_IPSDCarOk){
				platformDoorState = '<span class="cv-platform-door-failure '+position+'"></span>';
			}
			else{
				platformDoorState = '<span class="cv-platform-door-unknown '+position+'"></span>';
			}
			let IDoorClosed = channels[_.where(configData, {"name": 'DCU'+i+'_IDoorClosed_'+obj.vehicleType})[0].shortName][0];
			let IDoorLocked = channels[_.where(configData, {"name": 'DCU'+i+'_IDoorLocked_'+obj.vehicleType})[0].shortName][0];
			let IDoorOpened = channels[_.where(configData, {"name": 'DCU'+i+'_IDoorOpened_'+obj.vehicleType})[0].shortName][0];
			let ICrewSwitStat = channels[_.where(configData, {"name": 'DCU'+i+'_ICrewSwitStat_'+obj.vehicleType})[0].shortName][0];
			let IDoorMajorFault = channels[_.where(configData, {"name": 'DCU'+i+'_IDoorMajorFault_'+obj.vehicleType})[0].shortName][0];
			let IDoorMinorFault = channels[_.where(configData, {"name": 'DCU'+i+'_IDoorMinorFault_'+obj.vehicleType})[0].shortName][0];
			let ILockOutAct = channels[_.where(configData, {"name": 'DCU'+i+'_ILockOutAct_'+obj.vehicleType})[0].shortName][0];
			let IDevAlive = channels[_.where(configData, {"name": 'DCU'+i+'_IDevAlive_'+obj.vehicleType})[0].shortName][0];

			if(IDoorClosed && IDoorLocked){
				doorHtml+='<img src="PNG/Door_States/closed_and_locked.png" alt="door_image">'+platformDoorState;
			}
			else if(IDoorClosed && !IDoorLocked){
				doorHtml+='<img src="PNG/Door_States/closed_and_unlocked.png" alt="door_image">'+platformDoorState;				
			}
			else if(IDoorOpened){
				doorHtml+='<img src="PNG/Door_States/opened.png" alt="door_image">'+platformDoorState;
			}
			else if(ICrewSwitStat){
				doorHtml+='<img src="PNG/Door_States/crew_switch_on_open_position.png" alt="door_image">'+platformDoorState;
			}
			else if(IDoorMajorFault || IDoorMinorFault){
				doorHtml+='<img src="PNG/Door_States/failure.png" alt="door_image">'+platformDoorState;
			}
			else if(ILockOutAct){
				doorHtml+='<img src="PNG/Door_States/isolated.png" alt="door_image">'+platformDoorState;
			}
			else if(IDevAlive){
				doorHtml+='<img src="PNG/Door_States/no_communication.png" alt="door_image">'+platformDoorState;				
			}
			doorHtml+='</div>';
		}
		doorHtml +='</div></div>'
		
	});
	$("#cvCabinDoors").html(doorHtml);
	return ;
}


function drawCabinStates(configData,channels,unit){
	let LI_NActiveCabRly_DMC1 = channels[_.where(configData, {"name": 'LI_NActiveCabRly_DMC1'})[0].shortName][0];
	let LI_NActiveCabRly_DMC2 = channels[_.where(configData, {"name": 'LI_NActiveCabRly_DMC2'})[0].shortName][0];
	let LI_NeutCabRly_DMC1 = channels[_.where(configData, {"name": 'LI_NeutCabRly_DMC1'})[0].shortName][0];
	let LI_NeutCabRly_DMC2 = channels[_.where(configData, {"name": 'LI_NeutCabRly_DMC2'})[0].shortName][0];
	let directionHtml = '';
	$('.cv-forward-direction').removeClass('cv-active');
	$('.cv-forward-direction').removeClass('cv-neutralized');
	$('.cv-reverse-direction').removeClass('cv-active');
	$('.cv-reverse-direction').removeClass('cv-neutralized');
	
	if(LI_NActiveCabRly_DMC1){
		$('.cv-forward-direction').addClass('cv-active');
	}
	if(LI_NActiveCabRly_DMC2){
		$('.cv-reverse-direction').addClass('cv-active');
	}
	if(LI_NeutCabRly_DMC1){
		$('.cv-forward-direction').addClass('cv-neutralized');
	}
	if(LI_NeutCabRly_DMC2){
		$('.cv-reverse-direction').addClass('cv-neutralized');
	}
	if(unit.unitOrientation == 0){
		directionHtml = '<img class="cv-direction-arrow" src="PNG/Train_direction/forward_direction_selected.png"/>';
	}
	else{
		directionHtml = '<img class="cv-direction-arrow cv-reverse-arrow" src="PNG/Train_direction/reverse_direction_selected.png"/>';
	}
	$('.cv-forward-direction').html(directionHtml);
}

function getPCEState(configData,channels,unit,pceValue){
	let PCEState = '';
	let PCE_IDevOper = channels[_.where(configData, {"name": 'PCE'+pceValue+'_IDevOper'})[0].shortName][0];
	let PCE_I4QCLockOut = channels[_.where(configData, {"name": 'PCE'+pceValue+'_I4QCLockOut'})[0].shortName][0];
	let PCE_IBCLockOut = channels[_.where(configData, {"name": 'PCE'+pceValue+'_IBCLockOut'})[0].shortName][0];
	let PCE_IInvLockOut = channels[_.where(configData, {"name": 'PCE'+pceValue+'_IInvLockOut'})[0].shortName][0];
	let PCE_IMajorFltPres = channels[_.where(configData, {"name": 'PCE'+pceValue+'_IMajorFltPres'})[0].shortName][0];
	let PCE_IMinorFltPres = channels[_.where(configData, {"name": 'PCE'+pceValue+'_IMinorFltPres'})[0].shortName][0];
	// let BCE_EmyBrkTL = channels[_.where(configData, {"name": 'BCE'+pceValue+'_EmyBrkTL'})[0].shortName][0];

	if(!PCE_IDevOper){
		PCEState = '<img src="PNG/PCE_States/unknown.png" alt="pce_image" />';
	}
	else if(PCE_I4QCLockOut || PCE_IBCLockOut || PCE_IInvLockOut){
		PCEState = '<img src="PNG/PCE_States/locked-out.png" alt="pce_image" />';
	}
	else if(PCE_IInvIsol){
		PCEState = '<img src="PNG/PCE_States/isolated.png" alt="pce_image" />';
	}
	else if(PCE_IMajorFltPres){
		PCEState = '<img src="PNG/PCE_States/major-fault.png" alt="pce_image" />';
	}
	else if(PCE_IMinorFltPres){
		PCEState = '<img src="PNG/PCE_States/minor_fault.png" alt="pce_image" />';
	}
	else if(PCE_IDevOper){
		PCEState = '<img src="PNG/PCE_States/ok.png" alt="pce_image" />';
	}
	return PCEState;
}

function getBCEStates(configData,channels,unit,bceValue){
	let BCEState = '';
	let iDevOperVal = bceValue[0] == 1 ? 1 : 4;
	let BCE_IDevOper = channels[_.where(configData, {"name": 'BCE'+iDevOperVal+'_IDevOper'})[0].shortName][0];
	let BCE_CPnBrkBIsolBCE = channels[_.where(configData, {"name": 'BCE_CPnBrkB'+bceValue[0]+'IsolBCE'+bceValue[1]})[0].shortName][0];
	let BCE_IFltBrkBlAplBCE = channels[_.where(configData, {"name": 'BCE'+iDevOperVal+'_IFltBrkBlAplBCE'+bceValue[1]})[0].shortName][0];
	let BCE_IFltNoBrkBCE = channels[_.where(configData, {"name": 'BCE'+iDevOperVal+'_IFltNoBrkBCE'+bceValue[1]})[0].shortName][0];
	let BCE_Break = true;

	if(iDevOperVal==1){
		BCE_Break = channels[_.where(configData, {"name": 'BCE'+iDevOperVal+'_IPnBrkPressFBCE'+iDevOperVal})[0].shortName][0];
	}
	else{
		BCE_Break = channels[_.where(configData, {"name": 'BCE'+iDevOperVal+'_IPnBrkPressRBCE'+iDevOperVal})[0].shortName][0];
	}

	if(BCE_IDevOper){
		BCEState = '<img src="PNG/BCE_States/unknown.png" alt="bce_image" />';
	}
	else if(BCE_CPnBrkBIsolBCE){
		BCEState = '<img src="PNG/BCE_States/isolated.png" alt="bce_image" />';
	}
	else if(BCE_IFltBrkBlAplBCE){
		BCEState = '<img src="PNG/BCE_States/applied_and_faulty.png" alt="bce_image" />';
	}
	else if(BCE_IFltNoBrkBCE){
		BCEState = '<img src="PNG/BCE_States/released_and_faulty.png" alt="bce_image" />';
	}
	else if(BCE_Break <  0.1){
		BCEState = '<img src="PNG/BCE_States/ok_and_applied.png" alt="bce_image" />';
	}
	else if(BCE_Break >  0.1){
		BCEState = '<img src="PNG/BCE_States/ok_and_released.png" alt="bce_image" />';
	}
	return BCEState;	
}

function getParkingBreakSatus(configData,channels,unit,breakValue){
	let parkingBreakState = '';
	let iDevOperVal = breakValue <= 2 ? 1 : 4;
	let BCE_IDevOper = channels[_.where(configData, {"name": 'BCE'+iDevOperVal+'_IDevOper'})[0].shortName][0];
	let BCE_CPBrkIsolCockBCE =channels[_.where(configData, {"name": 'BCE_CPBrkIsolCockBCE'+breakValue})[0].shortName][0]; 
	let BCE1_ITPBSensFailBCE =channels[_.where(configData, {"name": 'BCE1_ITPBSensFailBCE'+breakValue})[0].shortName][0]; 
	let BCE1_IParkBrkAplBCE =channels[_.where(configData, {"name": 'BCE1_IParkBrkAplBCE'+breakValue})[0].shortName][0]; 
	let BCE1_IParkBrkRelBCE =channels[_.where(configData, {"name": 'BCE1_IParkBrkRelBCE'+breakValue})[0].shortName][0]; 
	if(BCE_IDevOper){
		parkingBreakState = '<img src="PNG/Parking_brakes_states/unknown.png" alt="parking_break_image" />';
	}
	else if(BCE_CPBrkIsolCockBCE){
		parkingBreakState = '<img src="PNG/Parking_brakes_states/isolated.png" alt="parking_break_image" />';
	}
	else if(BCE1_ITPBSensFailBCE){
		parkingBreakState = '<img src="PNG/Parking_brakes_states/fault.png" alt="parking_break_image" />';
	}
	else if(BCE1_IParkBrkAplBCE){
		parkingBreakState = '<img src="PNG/Parking_brakes_states/ok_and_applied.png" alt="parking_break_image" />';
	}
	else if(BCE1_IParkBrkRelBCE){
		parkingBreakState = '<img src="PNG/Parking_brakes_states/ok_and_released.png" alt="parking_break_image" />';
	}
	return parkingBreakState;
}

function getPantographStates(configData,channels,unit,pantographValue){
	let pantographState ='';
	let LI_NRIOM2CB1Trip_TC = channels[_.where(configData, {"name": 'LI_NRIOM2CB1Trip_TC'+pantographValue})[0].shortName][0];
	let LI_TWVInVentPos_TC = channels[_.where(configData, {"name": 'LI_TWVInVentPos_TC'+pantographValue})[0].shortName][0];
	let LO_PantoRiseCmd_TC = channels[_.where(configData, {"name": 'LO_PantoRiseCmd_TC'+pantographValue})[0].shortName][0];
	let LI_NPantoCmdRly_TC = channels[_.where(configData, {"name": 'LI_NPantoCmdRly_TC'+pantographValue})[0].shortName][0];
	let LI_PantoUpPS_TC = channels[_.where(configData, {"name": 'LI_PantoUpPS_TC'+pantographValue})[0].shortName][0];

	if(LI_NRIOM2CB1Trip_TC){
		pantographState = '<img src="PNG/Pantograph_states/unknown.png" alt="parking_break_image" />';
	}
	else if(LI_TWVInVentPos_TC){
		pantographState = '<img src="PNG/Pantograph_states/isolated.png" alt="parking_break_image" />';
	}
	else if(LO_PantoRiseCmd_TC){
		pantographState = '<img src="PNG/Pantograph_states/up.png" alt="parking_break_image" />';
	}
	else if(LI_NPantoCmdRly_TC){
		pantographState = '<img src="PNG/Pantograph_states/down.png" alt="parking_break_image" />';
	}
	else if(LI_NPantoCmdRly_TC && LI_PantoUpPS_TC){
		pantographState = '<img src="PNG/Pantograph_states/failure_going_down.png" alt="parking_break_image" />';
	}
	else if(LO_PantoRiseCmd_TC && LI_PantoUpPS_TC){
		pantographState = '<img src="PNG/Pantograph_states/failure_going_up.png" alt="parking_break_image" />';
	}
	return pantographState;
	
}

function VCBStates(configData,channels,unit,vcbValue){
	let vcbState ='';
	let LO_VCBCloseCmd1_DMC = channels[_.where(configData, {"name": 'LO_VCBCloseCmd1_DMC'+vcbValue})[0].shortName][0];
	let LO_VCBCloseCmd2_DMC = channels[_.where(configData, {"name": 'LO_VCBCloseCmd2_DMC'+vcbValue})[0].shortName][0];
	let LI_NVCBClsCmdRly_TC = channels[_.where(configData, {"name": 'LI_NVCBClsCmdRly_TC'+vcbValue})[0].shortName][0];
	let LI_VCBOpen_TC = channels[_.where(configData, {"name": 'LI_VCBOpen_TC'+vcbValue})[0].shortName][0];

	if(LO_VCBCloseCmd1_DMC && LO_VCBCloseCmd2_DMC && LI_NVCBClsCmdRly_TC){
		vcbState = '<img src="PNG/VCB_states/fault_abnormally_opened.png" alt="vcb_image" />';
	}
	else if(!LO_VCBCloseCmd1_DMC && !LO_VCBCloseCmd2_DMC && !LI_NVCBClsCmdRly_TC){
		vcbState = '<img src="PNG/VCB_states/fault_abnormally_closed.png" alt="vcb_image" />';
	}
	else if(LI_VCBOpen_TC){
		vcbState = '<img src="PNG/VCB_states/normally_opened.png" alt="vcb_image" />';
	}
	else if(LO_VCBCloseCmd1_DMC && LO_VCBCloseCmd2_DMC && !LI_NVCBClsCmdRly_TC1){
		vcbState = '<img src="PNG/VCB_states/normally_closed.png" alt="vcb_image" />';
	}
	else{
		vcbState = '<img src="PNG/VCB_states/unknown.png" alt="vcb_image" />';
	}
	return vcbState;
}

function compressorStates(configData,channels,unit,compressorValue){
	let compressorState = '';
	let LI_AGTUCtrlCBTrip_DMC = channels[_.where(configData, {"name": 'LI_AGTUCtrlCBTrip_DMC'+compressorValue})[0].shortName][0];
	let LI_AGTUMotCBTrip_DMC = channels[_.where(configData, {"name": 'LI_AGTUMotCBTrip_DMC'+compressorValue})[0].shortName][0];
	let LI_CmpStop1_DMC = channels[_.where(configData, {"name": 'LI_CmpStop1_DMC'+compressorValue})[0].shortName][0];
	let LI_CmpStop2_DMC = channels[_.where(configData, {"name": 'LI_CmpStop2_DMC'+compressorValue})[0].shortName][0];
	let LO_CmdCmp1_DMC = channels[_.where(configData, {"name": 'LO_CmdCmp1_DMC'+compressorValue})[0].shortName][0];
	let LO_CmdCmp2_DMC = channels[_.where(configData, {"name": 'LO_CmdCmp2_DMC'+compressorValue})[0].shortName][0];
	if(LI_AGTUCtrlCBTrip_DMC && LI_AGTUMotCBTrip_DMC){
		compressorState = '<img src="PNG/compressor_states/unknown.png" alt="vcb_image" />';
	}
	else if(LI_CmpStop1_DMC && LI_CmpStop2_DMC){
		compressorState = '<img src="PNG/compressor_states/unknown.png" alt="vcb_image" />';
	}
	else if(LO_CmdCmp1_DMC && LO_CmdCmp2_DMC){
		compressorState = '<img src="PNG/compressor_states/unknown.png" alt="vcb_image" />';
	}
	else{
		compressorState = '<img src="PNG/compressor_states/unknown.png" alt="vcb_image" />';
	}
	return compressorState;
}

function ACEStates(configData,channels,unit,aceValue){
	let aceState = '';
	let ACE_IDevOper = channels[_.where(configData, {"name": 'ACE'+aceValue+'_IDevOper'})[0].shortName][0];
	let ACE_Cbypass = channels[_.where(configData, {"name": 'ACE'+aceValue+'_CBypass'})[0].shortName][0];
	let ACE_IExtPow400V = channels[_.where(configData, {"name": 'ACE'+aceValue+'_IExtPow400V'})[0].shortName][0];
	let ACE_I4QCPermFlt = channels[_.where(configData, {"name": 'ACE'+aceValue+'_I4QCPermFlt'})[0].shortName][0];
	let ACE_I3PInvPermFlt = channels[_.where(configData, {"name": 'ACE'+aceValue+'_I3PInvPermFlt'})[0].shortName][0];
	let ACE_IMajorFltPres = channels[_.where(configData, {"name": 'ACE'+aceValue+'_IMajorFltPres'})[0].shortName][0];
	let ACE_IMinorFltPres = channels[_.where(configData, {"name": 'ACE'+aceValue+'_IMinorFltPres'})[0].shortName][0];
	let ACE_IACInAvail = channels[_.where(configData, {"name": 'ACE'+aceValue+'_IACInAvail'})[0].shortName][0];
	let ACE_I4QCState = channels[_.where(configData, {"name": 'ACE'+aceValue+'_I4QCState'})[0].shortName][0];
	let ACE_I3PInvState = channels[_.where(configData, {"name": 'ACE'+aceValue+'_I3PInvState'})[0].shortName][0];
	let ACE_IBattChargState = channels[_.where(configData, {"name": 'ACE'+aceValue+'_IBattChargState'})[0].shortName][0];
	let ACE_IACOutAvail = channels[_.where(configData, {"name": 'ACE'+aceValue+'_IACOutAvail'})[0].shortName][0];
	let ACE_IDCOutAvail = channels[_.where(configData, {"name": 'ACE'+aceValue+'_IDCOutAvail'})[0].shortName][0];

	if(ACE_IDevOper){
		aceState = '<img src="PNG/ACE_states/unknown.png" alt="vcb_image" />';
	}
	else if(ACE_Cbypass){
		aceState = '<img src="PNG/ACE_states/isolated.png" alt="vcb_image" />'
	}
	else if(ACE_IExtPow400V){
		aceState = '<img src="PNG/ACE_states/shore_power_supply.png" alt="vcb_image" />'
	}
	else if(ACE_I4QCPermFlt & ACE_I3PInvPermFlt & ACE_IMajorFltPres & ACE_IMinorFltPres){
		aceState = '<img src="PNG/ACE_states/fault.png" alt="vcb_image" />'
	}
	else if(ACE_IACInAvail){
		aceState = '<img src="PNG/ACE_states/ok_but_no_hve_presence.png" alt="vcb_image" />'
	}
	else if(ACE_I4QCState & ACE_I3PInvState & ACE_IBattChargState & ACE_IACOutAvail & ACE_IDCOutAvail){
		aceState = '<img src="PNG/ACE_states/ok.png" alt="vcb_image" />'
	}

	return aceState;
}

function switchAndByPass(configData,channels,unit,Value){
	let LI_EmBrkBypass_DMC = channels[_.where(configData, {"name": 'LI_EmBrkBypass_DMC'+Value})[0].shortName][0];
	let LI_DrsLpBypass_DMC = channels[_.where(configData,{"name":'LI_DrsLpBypass_DMC'+Value})[0].shortName][0];
	let ACE_CBypass = channels[_.where(configData,{"name":'ACE'+Value+'_CBypass'})[0].shortName][0];
	let LI_ServBrkBypass_DMC = channels[_.where(configData,{"name":'LI_ServBrkBypass_DMC'+Value})[0].shortName][0];
	let LI_FwdIsolTL_DMC = channels[_.where(configData,{"name":'LI_FwdIsolTL_DMC'+Value})[0].shortName][0];
	let LI_BackUpBrkTL_DMC = channels[_.where(configData,{"name":'LI_BackUpBrkTL_DMC'+Value})[0].shortName][0];
	let LI_DrsSwitchATC2_DMC = channels[_.where(configData,{"name":'LI_DrsSwitchATC2_DMC'+Value})[0].shortName][0];
	let LI_DrsSwitchATC1_DMC = channels[_.where(configData,{"name":'LI_DrsSwitchATC1_DMC'+Value})[0].shortName][0];
	let LI_ExtEmLight_DMC = channels[_.where(configData,{"name":'LI_ExtEmLight_DMC'+Value})[0].shortName][0];

	if(LI_EmBrkBypass_DMC){
		$('#LI_EmBrkBypass_DMC'+Value).removeClass().addClass('cv-state cv-active');
	}
	else if(LI_EmBrkBypass_DMC == false){
		$('#LI_EmBrkBypass_DMC'+Value).removeClass().addClass('cv-state cv-not-active');
	}
	else{
		$('#LI_EmBrkBypass_DMC'+Value).removeClass().addClass('cv-state cv-unknown');
	}

	if(LI_DrsLpBypass_DMC){
		$('#LI_DrsLpBypass_DMC'+Value).removeClass().addClass('cv-state cv-active');
	}
	else if(LI_DrsLpBypass_DMC == false){
		$('#LI_DrsLpBypass_DMC'+Value).removeClass().addClass('cv-state cv-not-active');
	}
	else{
		$('#LI_DrsLpBypass_DMC'+Value).removeClass().addClass('cv-state cv-unknown');
	}

	if(ACE_CBypass){
		$('#ACE'+Value+'_CBypass').removeClass().addClass('cv-state cv-active');
	}
	else if(ACE_CBypass == false){
		$('#ACE'+Value+'_CBypass').removeClass().addClass('cv-state cv-not-active');
	}
	else{
		$('#ACE'+Value+'_CBypass').removeClass().addClass('cv-state cv-unknown');
	}

	if(LI_ServBrkBypass_DMC){
		$('#LI_ServBrkBypass_DMC'+Value).removeClass().addClass('cv-state cv-active');
	}
	else if(LI_ServBrkBypass_DMC == false){
		$('#LI_ServBrkBypass_DMC'+Value).removeClass().addClass('cv-state cv-not-active');
	}
	else{
		$('#LI_ServBrkBypass_DMC'+Value).removeClass().addClass('cv-state cv-unknown');
	}

	if(LI_FwdIsolTL_DMC){
		$('#LI_FwdIsolTL_DMC'+Value).removeClass().addClass('cv-state cv-active');
	}
	else if(LI_FwdIsolTL_DMC == false){
		$('#LI_FwdIsolTL_DMC'+Value).removeClass().addClass('cv-state cv-not-active');
	}
	else{
		$('#LI_FwdIsolTL_DMC'+Value).removeClass().addClass('cv-state cv-unknown');
	}

	if(LI_BackUpBrkTL_DMC){
		$('#LI_BackUpBrkTL_DMC'+Value).removeClass().addClass('cv-state cv-active');
	}
	else if(LI_BackUpBrkTL_DMC == false){
		$('#LI_BackUpBrkTL_DMC'+Value).removeClass().addClass('cv-state cv-not-active');
	}
	else{
		$('#LI_BackUpBrkTL_DMC'+Value).removeClass().addClass('cv-state cv-unknown');
	}

	if(LI_ExtEmLight_DMC){
		$('#LI_ExtEmLight_DMC'+Value).removeClass().addClass('cv-state cv-active');
	}
	else if(LI_ExtEmLight_DMC == false){
		$('#LI_ExtEmLight_DMC'+Value).removeClass().addClass('cv-state cv-not-active');
	}
	else{
		$('#LI_ExtEmLight_DMC'+Value).removeClass().addClass('cv-state cv-unknown');
	}

	if(!LI_DrsSwitchATC2_DMC && !LI_DrsSwitchATC1_DMC){
		$('#doorCom'+Value).removeClass().addClass('cv-state cv-not-active');
	}
	else if(LI_DrsSwitchATC2_DMC){
		$('#doorCom'+Value).removeClass().addClass('cv-state cv-active');
	}
	else if(LI_DrsSwitchATC1_DMC){
		$('#doorCom'+Value).removeClass().addClass('cv-state cv-manual');
	}
	else{
		$('#doorCom'+Value).removeClass().addClass('cv-state cv-unknown');
	}

}

function drawMainEquipmentsHtml(configData,channels,unit){
	for (var i = 1; i <= 4; i++) {
		$('#PCE'+i).html(getPCEState(configData,channels,unit,i));
	}
	let counter = 0;
	for (var i = 1; i <= 2; i++) {
		for (var j = 1; j <= 4; j++) {
			counter +=1;
			$('#BCE'+(counter)).html(getBCEStates(configData,channels,unit,[i,j]));
		}
	}
	for (var i = 1; i <=4 ; i++) {
		$('#parkingBreak'+(i)).html(getParkingBreakSatus(configData,channels,unit,i));
	}
	for (var i = 1; i <=2 ; i++) {
		$('#pantograph'+(i)).html(getPantographStates(configData,channels,unit,i));
		$('#vcb'+(i)).html(VCBStates(configData,channels,unit,i));
		$('#compressor'+(i)).html(compressorStates(configData,channels,unit,i));
		$('#ace'+(i)).html(ACEStates(configData,channels,unit,i));
		switchAndByPass(configData,channels,unit,i);
	}
	
	return;
}

function drawSlipOrSlideDetection(configData,channels,unit){
	let PCE1_ISlide = channels[_.where(configData,{'name':'PCE1_ISlide'})[0].shortName][0];
	let PCE2_ISlide = channels[_.where(configData,{'name':'PCE2_ISlide'})[0].shortName][0];
	let PCE3_ISlide = channels[_.where(configData,{'name':'PCE3_ISlide'})[0].shortName][0];
	let PCE4_ISlide = channels[_.where(configData,{'name':'PCE4_ISlide'})[0].shortName][0];
	let EVR_CWSPInPrg_DMC1 = channels[_.where(configData,{'name':'EVR_CWSPInPrg_DMC1'})[0].shortName][0];
	let EVR_CWSPInPrg_TC1 = channels[_.where(configData,{'name':'EVR_CWSPInPrg_TC1'})[0].shortName][0];
	let EVR_CWSPInPrg_TC2 = channels[_.where(configData,{'name':'EVR_CWSPInPrg_TC2'})[0].shortName][0];
	let EVR_CWSPInPrg_DMC2 = channels[_.where(configData,{'name':'EVR_CWSPInPrg_DMC2'})[0].shortName][0];
	let PCE1_ISlip = channels[_.where(configData,{'name':'PCE1_ISlip'})[0].shortName][0];
	let PCE2_ISlip = channels[_.where(configData,{'name':'PCE2_ISlip'})[0].shortName][0];
	let PCE3_ISlip = channels[_.where(configData,{'name':'PCE3_ISlip'})[0].shortName][0];
	let PCE4_ISlip = channels[_.where(configData,{'name':'PCE4_ISlip'})[0].shortName][0];
	if(PCE1_ISlide || PCE2_ISlide || PCE3_ISlide || PCE4_Islide || EVR_CWSPInPrg_DMC1 || EVR_CWSPInPrg_TC1 || EVR_CWSPInPrg_TC2 || EVR_CWSPInPrg_DMC2){
		$('.cv-slide-slip-dectection').html('<img src="PNG/slide_or_slip_detection/slide_detection.png" alt="slide_or_slip_image" />');
	}
	else if(PCE1_ISlip || PCE2_ISlip || PCE3_ISlip || PCE4_ISlip){
		$('.cv-slide-slip-dectection').html('<img src="PNG/slide_or_slip_detection/slip_detection.png" alt="slide_or_slip_image" />')
	}
	return;
}

function drawVoltage(configData,channels,unit){

  let currentVoltage = channels[_.where(configData,{'name':'EVR_CHVVolt'})[0].shortName][0]*1000;

  let PCE2_ITracAch = channels[_.where(configData,{'name':'PCE2_ITracAch'})[0].shortName][0];
  let PCE1_ITracAch = channels[_.where(configData,{'name':'PCE1_ITracAch'})[0].shortName][0];
  let PCE3_ITracAch = channels[_.where(configData,{'name':'PCE3_ITracAch'})[0].shortName][0];
  let PCE4_ITracAch = channels[_.where(configData,{'name':'PCE4_ITracAch'})[0].shortName][0];
  let MPU_CEffDmd = channels[_.where(configData,{'name':'MPU_CEffDmd'})[0].shortName][0];
  let BCE4_IEffAch = channels[_.where(configData,{'name':'BCE4_IEffAch'})[0].shortName][0];
  
  // console.log(PCE2_ITracAch,PCE1_ITracAch,PCE3_ITracAch,PCE4_ITracAch);

  let tractionPercentage = PCE2_ITracAch+PCE1_ITracAch+PCE3_ITracAch+PCE4_ITracAch;

  console.log(MPU_CEffDmd,BCE4_IEffAch,tractionPercentage,PCE2_ITracAch,PCE1_ITracAch,PCE3_ITracAch,PCE4_ITracAch);

  var percentage = currentVoltage/31250 * 100;
  //Generic column color
  let color = 'black';

  // console.log(BCE4_IEffAch-tractionPercentage);
  let bottomPercentage = 50;
  let topPercentage=50;
  if(BCE4_IEffAch <0){
  	bottomPercentage = bottomPercentage-tractionPercentage;
  }
  else{
  	topPercentage = topPercentage - tractionPercentage;
  }

  console.log(topPercentage,tractionPercentage,bottomPercentage);
  $('.cv-column-dummy1').animate({
    height: bottomPercentage+'%',
  });
  $('.cv-column-current').animate({
    height: tractionPercentage+'%',
  });
  $('.cv-column-dummy2').animate({
    height: topPercentage+'%',
  });
  $('.cv-traction-arrow').animate({
  	top:MPU_CEffDmd+50+'%',
  });
  $('.cv-voltage-arrow').animate({
  	bottom:percentage+'%',
  })
  $('.cv-column').css({background: color});
  $('.cv-column-new').css({background: '#81C784'});
  $('.cv-column').animate({
    height: percentage+'%',
  });
  $('.cv-column-new').animate({
    height: percentage+'%',
  });
  
  $('.percentage').text(Math.round(percentage)+'%');
  $('.cv-value').text(currentVoltage+' V');
  
}

// Main function to draw all states to the page
function drawCMRLView(configData,liveData,unitsData,unitId){
	console.log(unitId);
	let currentUnitData = _.where(unitsData, {"id": parseInt(unitId)})[0];
	drawSpeedInfo(configData,liveData.channels,currentUnitData);
	drawDoorStates(configData,liveData.channels,currentUnitData);
	drawCabinStates(configData,liveData.channels,currentUnitData);
	drawMainEquipmentsHtml(configData,liveData.channels,currentUnitData);
	drawSlipOrSlideDetection(configData,liveData.channels,currentUnitData);
	drawVoltage(configData,liveData.channels,currentUnitData);
}



var unitId = 102;
$("#trainList").change(function() {
    unitId = $('option:selected', this).val();
    getData(unitId);
});

function getData(unitId){
	getToken(function(d) {
	    getChannelConfig(function(configData){
	    	getLiveData(function(liveData){
	    		getUnitsData(function(unitsData){
	    			console.log(configData,liveData,unitsData,unitId,"ASDASDASDASDAS")
	    			drawCMRLView(configData,liveData,unitsData,unitId);
	    		})
	    	})
	    });
	});
}
getToken(function(d) {
    getChannelConfig(function(configData){
    	getLiveData(function(liveData){
    		getUnitsData(function(unitsData){
    			console.log(unitsData);
    			for (var i = 0; i <= unitsData.length-1; i++) {
			        $('#trainList').append('<option value="' + unitsData[i].id + '">' + unitsData[i].unitNumber + '</option>');
			    }
    			drawCMRLView(configData,liveData,unitsData,unitId);
    		})
    	})
    });
});
