import React, { useState } from 'react';

function TW4Briefs() {
  const [expandedItems, setExpandedItems] = useState({});
  const [currentBrief, setCurrentBrief] = useState('fam'); // 'fam' or 'forms'
  const briefTitle = currentBrief === 'fam'
    ? 'T-6B MISSION/NATOPS BRIEFING GUIDE FOR FAM, VNAV, and INAV STAGES'
    : 'T-6B MISSION/NATOPS BRIEFING GUIDE FOR FORM AND CAPSTONE STAGES';
  const toggleButtonText = currentBrief === 'fam' ? 'Switch to FORM Brief' : 'Switch to FAM Brief';

  const toggleItem = (itemKey) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const expandAll = (briefData) => {
    const allExpanded = {};
    Object.keys(briefData).forEach(section => {
      if (briefData[section].items) {
        briefData[section].items.forEach((item, idx) => {
          if (item.expanded) {
            allExpanded[`${section}-${idx}`] = true;
          }
        });
      }
    });
    setExpandedItems(allExpanded);
  };

  const collapseAll = () => {
    setExpandedItems({});
  };

  const briefingData = {
    title: "T-6B MISSION/NATOPS BRIEFING GUIDE FOR FAM, VNAV, and INAV STAGES",
    administration: {
      title: "ADMINISTRATION",
      items: [
        {
          abbreviated: "I.M.S.A.F.E. Checklist.",
          expanded: "Both pilots must ensure they are safe to fly with regard to illness, medication, stress, alcohol, fatigue, and eating and respond, \"I'M SAFE.\" Address any human factors as appropriate."
        },
        {
          abbreviated: "Apply time critical Operational Risk Management",
          expanded: (
            <div>
              <ol type="a">
                <li><strong>Identify Hazards:</strong> What could go wrong?</li>
                <li><strong>Assess Hazards (severity/probability):</strong>
                  <ol style={{listStyleType: 'none', paddingLeft: '20px'}}>
                    <li>(1) How bad could it get?</li>
                    <li>(2) How likely is this to happen?</li>
                  </ol>
                </li>
                <li><strong>Make Risk Decisions:</strong>
                  <ol style={{listStyleType: 'none', paddingLeft: '20px'}}>
                    <li>(1) Can I control the risk?</li>
                    <li>(2) Does the benefit outweigh the cost?</li>
                    <li>(3) Can risk decisions be made at my level?</li>
                    <li>(4) Change plan as necessary to keep risk at acceptable level, and communicate with crew, ops, and front office if necessary.</li>
                  </ol>
                </li>
                <li><strong>Implement Controls:</strong> Target severity or probability determined above.</li>
                <li><strong>Supervise (based on situational changes):</strong> Change plan as necessary to keep risk at an acceptable level.</li>
              </ol>
            </div>
          ),
          alwaysExpanded: true
        },
        {
          abbreviated: "Airsickness history",
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li>Brief history of airsickness if applicable.</li>
                <li>"Aircrew must announce if they become passively or actively airsick and may pass the controls as the situation dictates. The flying pilot will keep the aircraft in a stable position, minimizing turns as the situation allows. If the airsick pilot feels he or she cannot continue, the mission will be aborted for airsickness."</li>
              </ol>
            </div>
          )
        },
        {
          abbreviated: "Work week limitation",
          expanded: "Ensure SNA has been scheduled no more than six days in a row."
        },
        {
          abbreviated: "ATJ review of stage performance",
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li>Any below MIF/ungraded/SSR items in block </li>
                <li>Previous hop complete?</li>
                <li>SNA on SMS?</li>
                <li>Is SNA/IUT in a warmup window?</li>
              </ol>
            </div>
          ),
          alwaysExpanded: true
        },
        {
          abbreviated: "Read and Initial",
          expanded: "Ensure aircrew are current on the read and initial board, have all appropriate changes incorporated into NATOPS and PCL, updated in-flight guide, and have current paper IFR and VFR publications as required."
        },
        {
          abbreviated: "Foreign Object Damage",
          expanded: "\"Ensure only those items required for flight are taken to the aircraft, and that all flight suit pockets are zippered. Both pilots will inspect BOTH cockpits before and after flight to ensure no FOD is present.\""
        },
        {
          abbreviated: "Training Time-Out/Drop on Request",
          expanded: "Review if necessary."
        }
      ]
    },
    weather: {
      title: "WEATHER",
      items: [
        {
          abbreviated: "Local area",
          expanded: "Brief current METARs for applicable local area and destination airfields. Note the expected runway(s) in use. Utilize Aviation Digital Data Service (ADDS) for current AIRMETs and SIGMETs."
        },
        {
          abbreviated: "Local area and destination forecast",
          expanded: "Utilize a combination of current Navy FWB DD175-1, approved commercial third-party application (ForeFlight) weather briefs, and applicable TAFs to determine existing and forecast weather for the entire route of flight, including destination and alternate forecasts for a period 1 hour before ETA until 1 hour after ETA. Include prevailing winds for your area/route of fight."
        },
        {
          abbreviated: "Night Considerations",
          expanded: (
            <div>
              <ol>
                <li>Sunset/Moonrise times</li>
                <li>Illumination level</li>
              </ol>
            </div>
          )
        },
        {
          abbreviated: "Weather at alternate",
          expanded: "See above."
        },
        {
          abbreviated: "TOLD Data",
          expanded: "Brief TOLD data based off DD175-1 Forecast MAX TEMP/Pressure Altitude, and applicable runway in use."
        }
      ]
    },
    navigation: {
      title: "NAVIGATION AND FLIGHT PLANNING",
      items: [
        {
          abbreviated: "Climb-out (brief expected coded departure for IFR)",
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li><strong>Familiarization and VNAV Stage.</strong> "Expected climb-out will be ______." (Ex. "Beachline Departure to North Mustangs")</li>
                <li><strong>INAV Stage.</strong> "We will expect the ________ departure (as appropriate for runway in use and filed flight plan) but will remain flexible for changes from ATC."</li>
              </ol>
            </div>
          )
        },
        {
           abbreviated: (
                <div>
                    <div>2. Mission planning, including fuel management</div>
                    <ol type="a" style={{marginTop: '5px'}}>
                        <li>NOTAMS, TFR's, BASH</li>
                        <li>Departure/Destination/Alternate airfield considerations</li>
                        <li>Flight Plan</li>
                        <li>Joker/Bingo</li>
                    </ol>
                </div>
            ),
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li>Brief applicable NOTAMS, TFRs, and BASH.</li>
                <li>Departure/Destination/Alternate airfield considerations (i.e. special taxi instructions, contract gas, PPR required, etc.)</li>
                <li>Flight Plan filed/required.</li>
                <li>Brief planned joker and bingo fuel for the mission to include how they were calculated and how they will apply.</li>
              </ol>
            </div>
          )
        },
        {
          abbreviated: "IMC Penetration",
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li><strong>Familiarization and VNAV Stage.</strong> "If an IMC penetration is required, the non-flying pilot will call out all airspeed deviations greater than 10 knots, heading deviations greater than 10 degrees, angles of bank greater than 30 degrees, altitude deviations greater than 100', and if descent rate is greater than current altitude remaining (Minute to Live Rule). Either pilot must announce if they experience any vertigo or spatial disorientation."</li>
                <li><strong>INAV Stage.</strong> "Not applicable."</li>
              </ol>
            </div>
          )
        },
        {
          abbreviated: "Approach/missed approach (Discuss MA CRM)",
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li><strong>Familiarization and VNAV Stage.</strong> "If an instrument approach is required, the IP (or SNA/IUT at the IP's discretion) will fly the approach to be backed up by the SNA/IUT on all headings, altitudes, airspeeds, angles of bank, and rates of descent. The SNA/IUT will call the runway environment in sight with clock position and repeat the current landing clearance."</li>
                <li><strong>INAV Stage.</strong> "Prior to the DH/VDP/MDA/MAP, the SNA/IUT will remain heads down flying the instrument approach. For training purposes, the IP will announce whether or not the runway environment is in sight. If no instruction is given, assume the field is not in sight. If the runway environment is not in sight by the decision height (DH) or missed approach point (MAP), we will execute the assigned missed approach or climb-out."</li>
              </ol>
            </div>
          )
        },
        {
          abbreviated: "Recovery",
          expanded: "\"We will plan to recover via (VFR course rules/VFR arrival/instrument approach) to (airfield).\""
        }
      ]
    },
    missionExecution: {
      title: "MISSION EXECUTION/CONDUCT",
      items: [
        {
          abbreviated: "Cockpit Assignment",
          expanded: "Brief cockpit assignment (front and rear)."
        },
        {
          abbreviated: "Profile/sequence of events",
          expanded: "Brief planned training area (KINGS4, MUSTANG or FOXTR), outlying field and route of flight as applicable. Brief planned profile and maneuver sequence."
        },
        {
          abbreviated: "Training rules – Read ELP rules verbatim",
          expanded: null  // This section is already complete in abbreviated form
        },
        {
          abbreviated: "G-Awareness procedures",
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li>"We will conduct a G-Ex prior to conducting any maneuvers requiring greater than three Gs, and preface all maneuvers with 'Gs coming on, NOW, NOW, NOW.' Either pilot experiencing gray-out conditions must immediately call 'Knock-it-Off' over the ICS and a contact unusual attitude must be used to recover the aircraft. In the event either pilot experiences a GLOC, the training portion of the flight will be terminated, and the IP will recover the aircraft to a suitable airfield."</li>
                <li><strong>INAV and VNAV Stage.</strong> "Not applicable."</li>
              </ol>
            </div>
          )
        },
        {
          abbreviated: "OLF operations and entry",
          expanded: "Brief planned OLF and entry method (Course Rules, PPEL, Instrument Approach)."
        }
      ]
    },
    communications: {
      title: "COMMUNICATIONS AND CREW COORDINATION",
      items: [
        {
          abbreviated: "Frequencies",
          expanded: "\"We will use preset UHF, VHF, and NAV frequencies, and manual frequencies as required.\""
        },
        {
          abbreviated: "Radio procedures and discipline",
          expanded: "\"The flying pilot will make all radio calls to be backed up by the non-flying pilot. Either pilot can make a safety of flight call. Keep all calls concise and professional.\""
        },
        {
          abbreviated: "Change of control of aircraft",
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li>"We will use a positive, three-way exchange of controls with emphasis on the word 'CONTROLS'. In the event of an ICS failure, we will use the 'Push-to-Pass, Shake-to-Take' method of control transfer with the non-flying pilot showing his or her hands for verification. If in doubt of who has control of the aircraft, query the other pilot. IP input does not constitute a change of controls unless there is an ICS failure."</li>
                <li>"Transfer of aircraft controls includes control of the FMS, UFCP and radios. The non-flying pilot may assist or assume control of the FMS, UFCP and radios as directed."</li>
              </ol>
            </div>
          )
        },
        {
          abbreviated: "Navigational aids",
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li><strong>Familiarization and VNAV Stage.</strong> "We will be primarily VFR today using ground reference checkpoints for navigation. However, we will keep the appropriate working area or navigation route in the FMS for back-up."</li>
                <li><strong>INAV Stage.</strong> "We will be primarily IFR today and use the VOR and FMS as appropriate for navigation."</li>
              </ol>
            </div>
          )
        },
        {
          abbreviated: "Identification (Brief Side No./ACID if known)",
          expanded: "\"Aircraft assignment will be (side number). Our Call-Sign will be BOOMER/RANGER/RUFNEK 7XX/8XX and we will squawk 55XX/56XX, or as assigned by ATC.\""
        },
        {
          abbreviated: "Clearing procedures",
          expanded: "\"Both pilots will maintain a vigilant lookout for other traffic using the TCAS and ADS-B to aid as appropriate. Call out all traffic using the clock system, high/level/low, factor/no factor, call a bird a bird, and plane a plane. Any pilot recognizing an immediate traffic conflict will maneuver the aircraft into a safe position and discuss traffic avoidance after it is no longer a factor.\""
        }
      ]
    },
    emergencies: {
      title: "EMERGENCIES",
      items: [
        {
          abbreviated: "Aborts",
          expanded: "\"Either pilot recognizing the need to abort will call 'ABORT, ABORT, ABORT' over the ICS. The flying pilot will execute the ABORT procedure IAW NATOPS. If we anticipate departing the prepared surface, we will execute the EMERGENCY ENGINE SHUTDOWN ON THE GROUND procedure. The aircraft commander will call 'CFS, CFS, CFS' to command execution of the canopy fracturing system, or 'EJECT, EJECT, EJECT' to command ejection as required.\""
        },
        {
          abbreviated: "Divert fields",
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li>"Our primary weather diverts in the local area will be Corpus Christi International (KCRP) and Victoria Regional (KVCT)."</li>
                <li>Brief emergency diverts for the planned working area or route of flight.</li>
              </ol>
            </div>
          )
        },
        {
          abbreviated: "Minimum and Emergency Fuel",
          expanded: "\"We will declare MIN FUEL if we anticipate landing below 200 pounds and EMERGENCY FUEL if we anticipate landing below 120 pounds.\""
        },
        {
          abbreviated: "Loss of power",
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li>"If we have an engine failure shortly after take-off, we will execute the ENGINE FAILURE IMMEDIATELY AFTER TAKEOFF emergency procedure, being mindful of aircraft configuration, energy state, and runway length remaining. If insufficient runway length remains to land straight ahead, we will eject."</li>
                <li>"If we have an engine failure elsewhere, we will execute the ENGINE FAILURE DURING FLIGHT emergency procedure. If we are unable to intercept an ELP for a suitable landing site, we will eject."</li>
              </ol>
            </div>
          )
        },
        {
          abbreviated: "Radio failure/ICS failure",
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li>"In the event of a radio or ICS failure, we will troubleshoot in an attempt to re-establish comms or ICS (i.e. check communications leads all the way to the O2 mask, the comm panel, and UFCP for appropriate frequencies and switchology)."</li>
                <li>"If we have a radio failure, we will attempt communication on another radio, using the standby VHF if necessary. If we have a total loss of communications in the local area, we will comply with the local letter of agreement for IFR and VFR aircraft. If we are outside of the local area, we will comply with the FIH."</li>
                <li>"If we have an ICS failure, we can remove our masks momentarily and shout or use frequencies 123.45 or 246.8 to communicate as necessary. If ICS cannot be restored, the instructional portion of the flight will be terminated, and we will land as soon as practical."</li>
              </ol>
            </div>
          )
        },
        {
          abbreviated: "Unintentional instrument flight",
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li><strong>Familiarization and VNAV Stage.</strong> "Instrument conditions are to be avoided at all times while operating VFR. If actual instrument flight is encountered:
                  <ol type="a" style={{marginTop: '5px'}}>
                    <li>Maintain aircraft control.</li>
                    <li>Establish an instrument scan and check altitude.</li>
                    <li>If altitude below Maximum Elevation Figure (MEF) + 1000 feet or Off Route Obstruction Clearance Altitude (OROCA), execute immediate climb to safe altitude turning away from known obstacles. Do not attempt to regain VMC below the calculated or published safe altitude.</li>
                    <li>If altitude above MEF + 1000 feet or OROCA, with smooth coordinated control inputs get out of IMC the way it was entered if climbing→descend (etc.).</li>
                    <li>If unable to regain VMC, the IP will contact the nearest ATC facility and coordinate an IFR clearance. If swift contact cannot be made, Squawk 7700, declare an emergency, and use guard as appropriate."</li>
                  </ol>
                </li>
                <li><strong>INAV Stage.</strong> "Not applicable."</li>
              </ol>
            </div>
          )
        },
        {
          abbreviated: "Loss of sight",
          expanded: "\"We will be single ship today.\""
        },
        {
          abbreviated: "Downed pilot and aircraft",
          expanded: "\"If we are first on scene to an aircraft mishap, we will assume on-scene commander duties. The flying pilot will establish the aircraft at a safe altitude and distance to maintain visual contact and the non-flying pilot will initiate the on-scene commander checklist. We will set a BINGO to the nearest suitable field and remain on-scene until we: 1) Reach our BINGO fuel; 2) Have an emergency of our own; 3) Are relieved by a more appropriate platform; 4) The rescue is complete. If we are not first on scene, we may offer assistance but will remain clear unless called upon.\""
        },
        {
          abbreviated: "Mid-Air/airborne damaged aircraft/bird strike",
          expanded: "\"Our first priority will be to maintain aircraft control. If we are unable to control the aircraft, we will eject. If the aircraft is controllable and we suspect possible engine damage (i.e. within the prop arc), we will execute a PEL to the nearest suitable airfield. If no engine damage is suspected, we will execute a Controllability Check as required.\""
        },
        {
          abbreviated: "OBOGS malfunctions/hypoxia symptoms",
          expanded: "\"If either member of the crew experiences hypoxic symptoms, or hypoxia is suspected for any reason, both crew members must execute the OBOGS FAILURE/PHYSIOLOGICAL SYMPTOMS procedure.\""
        },
        {
          abbreviated: "Unsafe Gear",
          expanded: "\"If on departure or recovery, the flying pilot will request entry into the Delta pattern and have tower or RDO inspect the gear while troubleshooting. If a form qualified pilot is in the area, we will coordinate a join up in the Delta pattern to conduct a visual gear inspection.\""
        },
        {
          abbreviated: <strong>12. OCF procedures (Brief every Flight)</strong>,
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li>"If we are in Out-of-Controlled Flight, we will execute the INADVERTENT DEPARTURE FROM CONTROLLED FLIGHT Emergency Procedure; PCL IDLE, controls neutral, altitude check, recover from unusual altitude."</li>
                <li>"OCF can be identified if the aircraft does not respond immediately and in a normal sense to application of flight controls. Airspeed in a steady-state spin will either be stable or it will oscillate above and below a constant airspeed, while the turn needle will be relied upon to indicate direction of rotation."</li>
              </ol>
            </div>
          )
        },
        {
          abbreviated: "Other Aircraft Emergencies / Simulated Emergencies",
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li>"All emergencies will be treated as actual unless prefaced with the word 'SIMULATED'. While troubleshooting, we will ensure that one pilot is always flying the aircraft. No fast hands in the cockpit. We will apply the following three rules for all emergencies: 1) Maintain aircraft control. 2) Analyze the situation and take proper action. 3) Land as soon as conditions permit."</li>
                <li>"In the event of an actual malfunction, the pilot recognizing the malfunction will call it out over the ICS. The flying pilot will execute any applicable 'critical action' procedures. The non-flying pilot will break out the PCL and review both critical and non-critical action items, as well as all notes, warnings, and cautions. Time permitting, we will get dual concurrence prior to moving the PCL to OFF, pulling the firewall shut-off handle, or switching the PMU to OFF."</li>
                <li><strong>Familiarization and VNAV Stage:</strong>
                  <ol type="a" style={{marginTop: '5px'}}>
                    <li>"In the event of a simulated power loss, the IP will initiate by stating, 'I HAVE THE PCL, SIMULATED', manipulate the PCL as required to simulate the power loss and set 4-6 percent torque upon hearing the SNA/IUT verbalize 'Simulated PCL–OFF.' In all cases, the flying pilot retains control of the aircraft and may utilize power as necessary."</li>
                    <li>"For all simulated malfunctions, the SNA/IUT will maintain control of the aircraft and recite the appropriate procedure, moving the landing gear and flap handles as appropriate. Do not move any other switches or handles in a simulated scenario."</li>
                  </ol>
                </li>
              </ol>
            </div>
          )
        },
        {
          abbreviated: "Ejection",
          expanded: (
            <div>
              <ol style={{marginTop: '5px'}}>
                <li>"Ejection is never simulated."</li>
                <li><strong>Immediate.</strong> "If impact is imminent with insufficient time for the normal cadence, we will both immediately pull the ejection handle."</li>
                <li><strong>Time Critical:</strong>
                  <ol type="a" style={{marginTop: '5px'}}>
                    <li>"To facilitate proper body position, the call for ejection will normally be a four-second cadence: <em>'EJECT, EJECT, EJECT,' pull (both)</em> the ejection handle. In the event of an ICS failure, execute three <em>raps</em> on the canopy, <em>pull (both)</em>."</li>
                    <li>"Ensure proper body position: back and musters against the seat, head on the head rest, chin up 10 degrees, feet on the rudder pedals, and elbows in tight toward the body. The minimum recommended altitude for uncontrolled ejection is 6,000 feet AGL, and 2,000 feet AGL for a controlled ejection."</li>
                  </ol>
                </li>
                <li><strong>Deliberate.</strong> "Time permitting, we will execute as many of the CONTROLLED EJECTION checklist steps as possible. The Controlled Ejection Area is defined as the CRP 170 radial at 20 DME (Chapman Ranch) heading 210."</li>
              </ol>
            </div>
          )
        }
      ]
    },
    trainingRules: {
      title: "TRAINING RULES FOR ELP",
      items: [
        {
          abbreviated: (
            <div>
              <div>1. A practiced Forced Landing (ELP) MUST be discontinued if the aircraft is below energy profile at Base Key.</div>
              <div>2. A landing is not required on a practice Forced Landing (ELP). When in doubt, WAVE OFF.</div>
              <div>3. During any Precautionary Emergency Landing (PEL), aircrew MUST WAVE OFF if stick shakers are actuated inside of Base Key or if airspeed decreases below 110 knots prior to the landing transition with no corresponding power correction.</div>
              <div>4. Student Naval Aviators must not conduct a practice Forced Landing (ELP) to a Flaps UP landing. If the aircraft cannot maintain minimum airspeed/profile beyond Base Key with flaps at Take Off or Landing, WAVE OFF.</div>
              <div>5. A properly flown (ELP) includes a gradual reduction of descent rate approaching the threshold, followed by a normal flare to land.</div>
            </div>
          ),
          expanded: null
        }
      ]
    }
  };

  const formsBrief = {
    title: "T-6B MISSION/NATOPS BRIEFING GUIDE FOR FORM AND CAPSTONE STAGES",
    administration: {
        title: "ADMINISTRATION",
        items: [
        {
            abbreviated: "I.M.S.A.F.E. Checklist.",
            expanded: "All pilots must ensure they are safe to fly with regard to illness, medication, stress, alcohol, fatigue, and eating and respond, \"I'M SAFE.\" Address any human factors as appropriate."
        },
        {
            abbreviated: "Apply time critical Operational Risk Management",
            expanded: (
                <div>
                <ol type="a">
                    <li><strong>Identify Hazards:</strong> What could go wrong?</li>
                    <li><strong>Assess Hazards (severity/probability):</strong>
                    <ol style={{listStyleType: 'none', paddingLeft: '20px'}}>
                        <li>(1) How bad could it get?</li>
                        <li>(2) How likely is this to happen?</li>
                    </ol>
                    </li>
                    <li><strong>Make Risk Decisions:</strong>
                    <ol style={{listStyleType: 'none', paddingLeft: '20px'}}>
                        <li>(1) Can I control the risk?</li>
                        <li>(2) Does the benefit outweigh the cost?</li>
                        <li>(3) Can risk decisions be made at my level?</li>
                        <li>(4) Change plan as necessary to keep risk at acceptable level, and communicate with crew, ops, and front office if necessary.</li>
                    </ol>
                    </li>
                    <li><strong>Implement Controls:</strong> Target severity or probability determined above.</li>
                    <li><strong>Supervise (based on situational changes):</strong> Change plan as necessary to keep risk at an acceptable level.</li>
                </ol>
                </div>
            ),
            alwaysExpanded: true
        },
        {
            abbreviated: "*Airsickness history",
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>Brief history of airsickness if applicable.</li>
                <li>"Standard."</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: "Work week limitation",
            expanded: "Ensure SNA has been scheduled no more than six days in a row."
        },
        {
            abbreviated: "ATJ review of stage performance",
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>Any below MIF/ungraded/SSR items in block</li>
                <li>Previous hop complete?</li>
                <li>SNA on SMS?</li>
                <li>Is the SNA/IUT in a warmup window?</li>
                </ol>
            </div>
            ),
            alwaysExpanded: true
        },
        {
            abbreviated: "Read and Initial",
            expanded: "Ensure aircrew are current on the read and initial board, have all appropriate changes incorporated into NATOPS and PCL, and have current paper IFR and VFR publications as required."
        },
        {
            abbreviated: "*Foreign Object Damage",
            expanded: "\"Standard.\""
        },
        {
            abbreviated: "Training Time-Out/Drop on Request",
            expanded: "Review if necessary."
        }
        ]
    },
    communications: {
        title: "COMMUNICATIONS AND CREW COORDINATION",
        items: [
        {
            abbreviated: "Frequencies",
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li><strong>UHF TAC Pri.</strong> Brief preset and manual primary and secondary frequencies.</li>
                <li><strong>VHF TAC Aux.</strong> Brief preset and manual primary and secondary frequencies.</li>
                <li>"All frequency changes will be auto-switch unless briefed. Lead will contact BOOMER/RANGER/RUFNEK Base to report the flight outbound. Lead will direct wing to switch base to get parking and report the flight complete."</li>
                <li>"Radio changes will generally be made one radio at a time, but dual swaps may be conducted at flight lead's discretion with a positive check-in over TAC."</li>
                <li>"If Wing is in doubt of which ATC frequency to switch to, we will utilize TAC to get well."</li>
                <li>"If radio traffic prohibits switch or if lost communications, frequency changes will be made via hand signals."</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: "Visual signals",
            expanded: "\"All signals will be made in a clear, exaggerated manner, utilizing a predictable cadence.\""
        },
        {
            abbreviated: "Radio procedures and discipline",
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>"Standard with the following additions."</li>
                <li>"Lead will primarily handle all radio calls but will be backed up by Wing."</li>
                <li>"If Lead is off frequency, Wing will respond to all radio calls and advise Lead over the TAC frequency as necessary."</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: "*Change of control of aircraft",
            expanded: "\"Standard.\""
        },
        {
            abbreviated: "Lead change",
            expanded: "\"The flight will use a positive, two-way lead change via hand signal. If there is any doubt about which aircraft has the lead, the lead aircraft will identify itself over the radio using its TAC callsign number.\""
        },
        {
            abbreviated: "*Navigational aids",
            expanded: "\"Standard.\""
        },
        {
            abbreviated: "Identification (Brief Side No./ACID if known)",
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>"The Designated Flight Lead will be [IP listed as Section Lead (SL) on flight schedule]."</li>
                <li>"The Formation Lead will be (SNA/IUT leading the formation)."</li>
                <li>"Our ATC call sign will be BOOMER/RANGER/RUFNEK XXX (Designated Flight Lead's ACID), and we will check-in with each agency as 'BOOMER/RANGER/RUFNEK XXX, flight of two'. All subsequent calls on a frequency will be 'BOOMER/RANGER/RUFNEK XXX, flight'."</li>
                <li>"We will squawk Designated Flight Lead's ACID (55XX or 56XX) or as assigned. Lead will squawk active while Wing backs up the same code in STBY."</li>
                <li>"Our tactical call sign will be _______. All '99 (area check-in) calls will be made with '[Tactical call sign], flight of two' (as required)."</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: "*Clearing procedures",
            expanded: "\"Standard.\""
        }
        ]
    },
    weather: {
        title: "WEATHER",
        items: [
        {
            abbreviated: "Local area",
            expanded: "Brief current METARs for applicable local area and destination airfields. Note the expected runway(s) in use. Utilize Aviation Digital Data Service (ADDS) for current AIRMETs and SIGMETs."
        },
        {
            abbreviated: "Local area and destination forecast",
            expanded: "Utilize a combination of current Navy FWB DD175-1, approved commercial third-party application (ForeFlight) weather briefs, and applicable TAFs to determine existing and forecast weather for the entire route of flight, including destination and alternate forecasts for a period 1 hour before ETA until 1 hour after ETA. Include prevailing winds for your area/route of fight."
        },
        {
            abbreviated: "Night Considerations",
            expanded: (
            <div>
                <ol>
                <li>Sunset/Moonrise times</li>
                <li>Illumination level</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: "Weather at alternate",
            expanded: "See above."
        },
        {
            abbreviated: "TOLD Data",
            expanded: "Brief TOLD data based off DD175-1 Forecast MAX TEMP/Pressure Altitude, and applicable runway in use."
        }
        ]
    },
    navigation: {
        title: "NAVIGATION AND FLIGHT PLANNING",
        items: [
        {
            abbreviated: "*Climb-out (brief expected coded departure for IFR if applicable)",
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>"_______ Departure to the _______ Working Area." (brief different working area or IFR coded departure as applicable)</li>
                <li>Takeoff and Rendezvous:</li>
                <li>"We will utilize an interval takeoff with a five second delay." (IP Discuss section takeoff as required for an IFR departure)</li>
                <li>"Lead will position on the downwind side of the runway, with enough room for wing to get in position on the opposite side."</li>
                <li>"After takeoff, wing will join in parade position utilizing the running rendezvous or CV rendezvous procedures."</li>
                <li>"When a CV rendezvous is utilized, wing will join on the outside of the turn. In the case when lead rolls out, exercise once a CV always a CV."</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: (
                <div>
                    <div>2. Mission planning, including fuel management</div>
                    <ol type="a" style={{marginTop: '5px'}}>
                        <li>NOTAMS, TFR's, BASH</li>
                        <li>Departure/Destination/Alternate airfield considerations</li>
                        <li>Flight Plan</li>
                        <li>Joker/Bingo</li>
                    </ol>
                </div>
            ),
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>Brief applicable NOTAMS, TFRs, and BASH.</li>
                <li>Departure/Destination/Alternate airfield considerations (i.e. special taxi instructions, contract gas, PPR required, etc.)</li>
                <li>Flight Plan filed/required</li>
                <li>Brief planned joker and bingo fuel for the mission to include how they were calculated and how they will apply.</li>
                <li>"We will update joker as required when entering the working area. When communicating fuel state, we will round down to the nearest 10 pounds. An ops check will be conducted prior to entering and exiting the working area, as well as after any lead changes."</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: "*IMC Penetration",
            expanded: "\"Will be flown by the IP and backed up by the SNA/IUT.\""
        },
        {
            abbreviated: "Approach/missed approach (Discuss MA CRM)",
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>"If unable to recover VFR, a section instrument approach, or individual instrument approaches will be flown at the Designated Flight Lead's discretion."</li>
                <li>"To fly a section approach, weather must be at or above circling minimums, or 1000/3 if no circling minimums are published. If a section instrument approach is flown, Lead must ensure wing remains in the Parade position for all IMC penetrations. If individual instrument approaches are flown, lead will coordinate separate squawks for the flight and ensure the aircraft with the lower fuel state exits the area first."</li>
                <li>"Execute the section missed approach IAW the FTI"</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: "Recovery",
            expanded: "\"We will plan to recover via (VFR course rules/VFR arrival/instrument approach) to (airfield).\""
        }
        ]
    },
    missionExecution: {
        title: "MISSION EXECUTION/CONDUCT",
        items: [
        {
            abbreviated: "Ground ops",
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>"Both aircraft will tune TAC VHF and check-in when ready to close canopy for start. Advise the other aircraft of any pre-flight issues in your aircraft or those noticed on the other aircraft."</li>
                <li>"Wing will taxi in the trail position, at one plane length."</li>
                <li>Brief cockpit assignment (front and rear).</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: (
                <div>
                    <div>2. Profile/Sequence of Events</div>
                    <ol type="a" style={{marginTop: '5px'}}>
                        <li>Training Area/Sequence of events</li>
                        <li>Navigation/route study (as applicable)</li>
                        <li>Flight Split/Rejoin (as applicable)</li>
                        <li>Section IFR approach (as applicable) *VMC only</li>
                    </ol>
                </div>
            ),
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>Brief planned training area (KINGS4, MUSTANG or FOXTR), outlying field and route of flight as applicable. Brief planned profile and maneuver sequence.</li>
                <li><strong>Capstone Stage:</strong>
                    <ol type="a" style={{marginTop: '5px'}}>
                    <li>Brief planned training area, and profile/sequence of events.</li>
                    <li>Brief planned VNAV route to include planned enroute lead changes if executed in a section as applicable.</li>
                    <li>Brief method of flight split and rejoin as applicable</li>
                    <li>Brief planned section IFR approaches (VMC only) as applicable.</li>
                    </ol>
                </li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: (
                <div>
                    <div style={{textDecoration: 'underline'}}>3. Training rules – Read ELP rules verbatim:</div>
                    <ol type="a" style={{marginTop: '5px'}}>
                        <li>Terminate</li>
                        <li>Knock-it-off</li>
                        <li>Resets</li>
                    </ol>
                </div>
            ),
            expanded: (
            <div>
                <div style={{marginTop: '5px'}}>
                <ol style={{marginTop: '5px'}}>
                    <li><strong>Terminate:</strong>
                    <ol type="a" style={{marginTop: '5px'}}>
                        <li>"Used to cease maneuvering for a non-safety related situation, such as when the desired learning objectives have been met."</li>
                        <li>"The call is made by lead or recommended by wing."</li>
                        <li>"Lead will then maneuver in a predictable manner to a safe flying attitude."</li>
                    </ol>
                    </li>
                    <li><strong>Knock-it-Off:</strong>
                    <ol type="a" style={{marginTop: '5px'}}>
                        <li>"Used when safety of flight is an issue, such as an emergency, a traffic threat, a crewmember has G-locked, or an impending boundary bust. Lead will direct a flow heading and altitude deconfliction."</li>
                        <li>"Any pilot can initiate and must state the reason if able."</li>
                        <li>"Lead will then maneuver in a predictable manner to a safe flying attitude and give their heading and altitude."</li>
                    </ol>
                    </li>
                    <li><strong>Resets:</strong> "Bearing line resets must be conducted at the discretion of the IP"</li>
                </ol>
                </div>
            </div>
            )
        },
        {
            abbreviated: "G-Awareness procedures",
            expanded: "\"We will conduct a G-ex prior to tail chase.\""
        },
        {
            abbreviated: "OLF operations and entry",
            expanded: "Brief planned OLF entry method, pattern operations, and follow on operations (full stop or rejoin)."
        }
        ]
    },
    emergencies: {
        title: "EMERGENCIES",
        items: [
        {
            abbreviated: "Aborts",
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>"Sympathetic aborts apply for an Interval Takeoff."</li>
                <li>"Both aircraft will maintain their side of the runway during the aborted takeoff."</li>
                <li>"Either lead or wing can abort the entire flight by transmitting, '[Tactical call sign] flight, abort' on tower frequency."</li>
                <li>"If lead aborts during an interval takeoff, they will abort the entire flight by calling '[Tactical call sign] flight, abort' on tower frequency and wing will abort behind them."</li>
                <li>"If wing aborts during an interval takeoff, they will wait to transmit until lead is safely airborne and then transmit 'BOOMER/RANGER/RUFNEK XXX, abort' on tower frequency and lead will coordinate with tower to return for a full stop."</li>
                <li>"Sympathetic aborts do not apply for a Section Takeoff."</li>
                <li>"If either aircraft aborts during a section takeoff, they will wait until the other aircraft is safely airborne and then call 'BOOMER/RANGER/RUFNEK XXX, abort' on tower frequency. The other aircraft will coordinate with tower to return for a full stop."</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: "Divert fields",
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>"Primary weather diverts will be in accordance with the SOP."</li>
                <li>Brief emergency diverts for the planned working area or route of flight.</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: "*Minimum and Emergency Fuel",
            expanded: "\"Standard.\""
        },
        {
            abbreviated: "*Loss of power",
            expanded: "\"Standard.\""
        },
        {
            abbreviated: "Radio failure/ICS failure",
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>"In the event of a radio or ICS failure, gain the attention of the other aircraft and pass the appropriate signal for down transmitter, down receiver, or both."</li>
                <li>"We will conduct a lead change, if required, to place the NORDO ('No Radio') aircraft in lead. If radio communications can't be established, the good aircraft will be placed in formation lead and inform approach and tower that wing is NORDO."</li>
                <li>"If inside the VFR entry point (Shamrock) or the initial if out of the local area, a lead change will not be conducted. The NORDO aircraft will pass the appropriate signal to the good aircraft. The good aircraft will handle communications, inform tower that the other is NORDO, and request Aldis Lamp signals. If lead is NORDO, wing will request that Tower call the break, and Lead will look to Wing for the kiss-off signal."</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: "Unintentional instrument flight",
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>"In the event the flight unintentionally encounters IMC, lead will transition to an instrument scan and wing will maintain parade position. Execute the Unintentional Instrument Flight procedure IAW the Contact FTI."</li>
                <li>"If unable to regain VMC, lead will contact ATC for an IFR clearance."</li>
                <li>"If wing loses sight of lead, wing will execute lost sight procedures."</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: (
                <div>
                    <div>7. Loss of sight/lost wingman</div>
                    <ol type="a" style={{marginTop: '5px'}}>
                        <li>Lost sight (IMC)</li>
                        <li>Blind (VMC)</li>
                    </ol>
                </div>
            ),
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li><strong>Lost Sight (IMC):</strong>
                    <ol type="a" style={{marginTop: '5px'}}>
                    <li>"If wing loses sight of lead in IMC, wing will transition to an instrument scan while smoothly reducing power by approximately 10%. Wing will then call '[Tactical call sign] one-two, lost sight, heading ____'. Lead will provide heading, altitude, and attitude as necessary, and the appropriate procedure will be executed:"</li>
                    <li>"If straight and level, wing will smoothly turn away from lead for a 30-degree heading change, time for 30 seconds, then turn to parallel lead's heading. Lead will transmit heading and altitude."</li>
                    <li>"If in a turn, the outside aircraft will roll wings level and transmit heading and altitude. The inside aircraft will continue to the assigned heading (at least 30 degrees from lost sight heading). After 30 seconds, the outside aircraft will turn to the assigned heading."</li>
                    <li>"If in a climb, wing will level off, state altitude, and execute the applicable lost sight procedure (straight and level or turn). Lead will continue climbing to the assigned altitude (not less than 500 feet above the lost sight altitude) and state heading and altitude."</li>
                    <li>"In a descent, wing will level off, state altitude, and execute applicable lost sight procedure (straight and level or turn). Lead will continue descending to the assigned altitude, ensure 500 feet of separation (directing a climb or descent for Wing as required) and state heading and altitude."</li>
                    <li>"In all above cases, lead will coordinate separate squawks and approaches with ATC unless we encounter VMC, in which case lead will direct a rejoin using VMC blind procedures."</li>
                    <li>"If on an instrument approach and inside the final approach fix, wing will turn away from lead and climb to Final Approach Fix altitude and proceed to the Missed Approach Point, perform missed approach procedures, and coordinate with ATC for a separate clearance. Lead will inform ATC and continue with the approach."</li>
                    </ol>
                </li>
                <li><strong>Blind (VMC):</strong>
                    <ol type="a" style={{marginTop: '5px'}}>
                    <li>"If wing loses visual contact in VMC, they will call '[Tactical call sign], Blind' and state altitude. If lead is visual, they will direct wing's eyes towards lead's position referencing a clock position (high/level/low) from wing."</li>
                    <li>"After each successive call from lead, wing will continue to call either 'blind' or 'visual.' After wing calls 'visual,' lead will be directive to either conduct a rendezvous or continue training."</li>
                    <li>"If both aircraft are blind, lead will be directive and descriptive in transmitting altitude, while maneuvering predictably to ensure a minimum of 500 feet of altitude separation, without flying through wing's altitude. Wing will lag lead's last known position and clear their flightpath. Lead will determine a rendezvous point and establish a 30-degree AOB turn at 200 KIAS specifying turn direction. When wing is visual, they will transmit '[Tactical call sign], Visual,' and lead will direct a rejoin."</li>
                    <li>"If either aircraft is NORDO, rendezvous at [pre-briefed point/radial DME] on a [prebriefed entry heading/radial intercept], maintaining at least 500' of altitude separation. The low aircraft will stay low, and the high aircraft will stay high. Wing will only commence rejoin once lead is observed established in the appropriate orbit and will rejoin co-altitude on the appropriate bearing line using normal rendezvous procedures."</li>
                    </ol>
                </li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: "Downed pilot and aircraft",
            expanded: "\"The Designated Flight Lead will direct on scene commander duties.\""
        },
        {
            abbreviated: "Mid-Air/airborne damaged aircraft/bird strike",
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>"Our first priority in all cases will be to maintain aircraft control. If we are unable to control the aircraft, we will ensure safe separation and eject."</li>
                <li>"If a single aircraft is damaged, that aircraft will communicate if able, climb to a safe altitude, assume lead as necessary, and assess damage. The good aircraft will assume the perch position and assist as necessary."</li>
                <li>"If severe damage occurs or both aircraft are affected, both aircraft must communicate, separate, maintain visual contact, and NOT rejoin as a flight. After separation is ensured and appropriate emergency checklists are complete, a game plan will be developed to get both aircraft safely on deck."</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: "*OBOGS malfunctions/hypoxia symptoms",
            expanded: "\"Standard.\""
        },
        {
            abbreviated: "Unsafe Gear",
            expanded: "\"The aircraft with the unsafe indication must notify the other aircraft, assume lead as necessary, notify ATC, and climb to an emergency orbit or delta pattern (at least 2000 feet AGL).\""
        },
        {
            abbreviated: <strong>12. OCF procedures (Brief every Flight)</strong>,
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>"If we are in Out-of-Controlled Flight, we will execute the INADVERTENT DEPARTURE FROM CONTROLLED FLIGHT Emergency Procedure; PCL IDLE, controls neutral, altitude check, recover from unusual altitude."</li>
                <li>"OCF can be identified if the aircraft does not respond immediately and in a normal sense to application of flight controls. Airspeed in a steady-state spin will either be stable or it will oscillate above and below a constant airspeed, while the turn needle will be relied upon to indicate direction of rotation."</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: "Other Aircraft Emergencies / Simulated Emergencies",
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>"The aircraft with the malfunction will assume the lead and direct the good aircraft to the support position. The Bleeder is the Leader. The support aircraft will match the emergency aircraft's configuration and detach when directed, no later than 300' AGL."</li>
                <li>"Lead's priorities will be Aviate, Communicate, Separate."</li>
                <li>"Wing's priorities will be Aviate, Separate, Communicate."</li>
                </ol>
            </div>
            )
        },
        {
            abbreviated: "Ejection",
            expanded: (
            <div>
                <ol style={{marginTop: '5px'}}>
                <li>"Immediate, time critical, and deliberate ejection is standard."</li>
                <li>"The good aircraft will look for two good chutes, act as on-scene commander, and at no time will we overfly or under-fly chutes."</li>
                </ol>
            </div>
            )
        }
        ]
    },
    trainingRules: {
        title: "TRAINING RULES FOR ELP",
        items: [
        {
            abbreviated: (
            <div>
                <div>1. A practiced Forced Landing (ELP) MUST be discontinued if the aircraft is below energy profile at Base Key.</div>
                <div>2. A landing is not required on a practice Forced Landing (ELP). When in doubt, WAVE OFF.</div>
                <div>3. During any Precautionary Emergency Landing (PEL), aircrew MUST WAVE OFF if stick shakers are actuated inside of Base Key or if airspeed decreases below 110 knots prior to the landing transition with no corresponding power correction.</div>
                <div>4. Student Naval Aviators must not conduct a practice Forced Landing (ELP) to a Flaps UP landing. If the aircraft cannot maintain minimum airspeed/profile beyond Base Key with flaps at Take Off or Landing, WAVE OFF.</div>
                <div>5. A properly flown (ELP) includes a gradual reduction of descent rate approaching the threshold, followed by a normal flare to land.</div>
            </div>
            ),
            expanded: null
        }
        ]
    }
  };


  const activeBrief = currentBrief === 'fam' ? briefingData : formsBrief;
  const renderSection = (sectionKey, briefData) => {
    const section = briefData[sectionKey];
    return (
      <div key={sectionKey} style={{marginBottom: '20px'}}>
        <h2 style={{
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '4px',
          backgroundColor: '#ddd',
          padding: '4px',
          border: '1px solid #000',
          textDecoration: 'underline'
        }}>
          {section.title}
        </h2>

        {section.items.map((item, idx) => {
          const itemKey = `${sectionKey}-${idx}`;
          const isExpanded = item.alwaysExpanded || expandedItems[itemKey];
          const isClickable = item.expanded && !item.alwaysExpanded;

          return (
            <div
              key={itemKey}
              style={{
                marginBottom: '4px',
                border: '1px solid #ccc',
                backgroundColor: item.expanded ? (isExpanded ? '#f0f8ff' : '#fff') : '#f5f5f5'
              }}
            >
              <div
                onClick={() => isClickable && toggleItem(itemKey)}
                style={{
                  padding: '4px 8px',
                  cursor: isClickable ? 'pointer' : 'default',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px'
                }}
              >
                {isClickable && (
                  <span style={{
                    fontSize: '10px',
                    lineHeight: '1.1',
                    color: '#666',
                    flexShrink: 0
                  }}>
                    {isExpanded ? '▼' : '▶'}
                  </span>
                )}
                <div style={{flex: 1}}>
                  {typeof item.abbreviated === 'string' ? (
                    <span style={{fontWeight: item.expanded && !item.alwaysExpanded ? 'normal' : 'bold'}}>
                      {idx + 1}. {item.abbreviated}
                    </span>
                  ) : (
                    <span style={{fontWeight: 'normal'}}>
                      {item.abbreviated}
                    </span>
                  )}
                </div>
              </div>

              {isExpanded && item.expanded && (
                <div style={{
                  padding: '8px 12px 8px 20px',
                  fontSize: '11px',
                  borderTop: '1px solid #ccc',
                  backgroundColor: '#f9f9f9',
                  lineHeight: '1.6'
                }}>
                  {typeof item.expanded === 'string' ? (
                    <div>{item.expanded}</div>
                  ) : (
                    item.expanded
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="page-container" style={{maxWidth: '1400px', margin: '0 auto', padding: '20px'}}>
      <h1 style={{fontSize: '16px', marginBottom: '10px', textAlign: 'center'}}>
        {briefTitle}
      </h1>

      <div className="button-row" style={{justifyContent: 'center', marginBottom: '20px'}}>
        <button onClick={() => expandAll(activeBrief)}>Expand All</button>
        <button onClick={collapseAll}>Collapse All</button>
        <button onClick={() => setCurrentBrief(currentBrief === 'fam' ? 'forms' : 'fam')}>{toggleButtonText}</button>
      </div>

      {currentBrief === 'fam' ? (
        <>
          {/* FAM BRIEF - PAGE 1 - Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Column 1: Administration and Weather */}
            <div>
              {renderSection('administration', activeBrief)}
              {renderSection('weather', activeBrief)}
            </div>

            {/* Column 2: Navigation, Mission Execution, Communications */}
            <div>
              {renderSection('navigation', activeBrief)}
              {renderSection('missionExecution', activeBrief)}
              {renderSection('communications', activeBrief)}
            </div>
          </div>

          {/* PAGE DIVIDER */}
          <div style={{
            height: '10px',
            backgroundColor: '#01202C',
            margin: '40px 0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}></div>

          {/* FAM BRIEF - PAGE 2 - Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Column 1: Emergencies */}
            <div>
              {renderSection('emergencies', activeBrief)}
            </div>

            {/* Column 2: Training Rules for ELP */}
            <div>
              {renderSection('trainingRules', activeBrief)}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* FORMS BRIEF - PAGE 1 - Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Column 1: Administration and Weather */}
            <div>
              {renderSection('administration', activeBrief)}
              {renderSection('weather', activeBrief)}
            </div>

            {/* Column 2: Communications, Navigation, Mission Execution */}
            <div>
              {renderSection('communications', activeBrief)}
              {renderSection('navigation', activeBrief)}
              {renderSection('missionExecution', activeBrief)}
            </div>
          </div>

          {/* PAGE DIVIDER */}
          <div style={{
            height: '10px',
            backgroundColor: '#01202C',
            margin: '40px 0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}></div>

          {/* FORMS BRIEF - PAGE 2 - Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Column 1: Administration and Weather (repeated) */}
            <div>
              {renderSection('emergencies', activeBrief)}
            </div>

            {/* Column 2: Communications, Navigation, Mission Execution (repeated) */}
            <div>
              {renderSection('trainingRules', activeBrief)}
            </div>
          </div>
        </>
      )}

      <div style={{marginTop: '30px', padding: '15px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', fontSize: '11px'}}>
        <strong>Note:</strong> Student Naval Aviators (SNA) and Instructors Under Training (IUT) are expected to brief training events. SNAs and IUTs must demonstrate a thorough knowledge of all discussion items, maneuvers, and special syllabus requirements to be completed in the block. Questions to clarify information that is not understood or is unclear are permissible, but the SNA/IUT retains ultimate responsibility for ensuring adequate preparation for the brief and flight.
      </div>
    </div>
  );
}

export default TW4Briefs;