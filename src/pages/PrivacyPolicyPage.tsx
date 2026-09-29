import React from 'react';
import { ShieldCheck, Lock, FileText, Server, AlertCircle } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 font-sans text-slate-200">
      {/* Header */}
      <div className="bg-command-900 border border-command-800 rounded-lg p-5 shadow">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-command-800 text-emerald-400 border border-command-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-mono text-white tracking-wide">
              GEOSPATIAL DATA PRIVACY POLICY
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Document Ref: GCVIAS-POL-PRIV-2026.1 | Effective Date: October 2024 | Version: 1.4
            </p>
          </div>
        </div>
      </div>

      {/* Main Legal Sections */}
      <div className="bg-command-900 border border-command-800 rounded-lg p-6 space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>1. Scope and Statutory Jurisdiction</span>
          </h2>
          <p>
            This Privacy Policy governs the collection, processing, storage, and dissemination of spatial data, infrastructure registries, user credentials, and operational logs within the Geospatial Cyclone Vulnerability and Infrastructure Assessment System (GCVIAS). GCVIAS is deployed for the express purpose of disaster risk assessment, anticipatory governance, and emergency response coordination by authorized State Disaster Management Authorities (SDMAs), District Emergency Operations Centers (DEOCs), and Municipal Incident Response Teams.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Server className="w-4 h-4 text-blue-400" />
            <span>2. Categories of Information Processed</span>
          </h2>
          <div className="space-y-2 pl-2 border-l-2 border-command-700">
            <p>
              <strong>2.1 Critical Infrastructure Coordinates:</strong> Geodetic coordinates (WGS-84), elevation data (Mean Sea Level), and operational capacity attributes of electrical substations, healthcare facilities, multipurpose shelters, and arterial roadways. These datasets originate from verified government repositories and designated open-access geospatial cartography.
            </p>
            <p>
              <strong>2.2 Meteorological & Oceanographic Telemetry:</strong> Ingested cyclone tracks, wind quadrant radii, barometric central pressures, and storm surge indices sourced from official meteorological agencies.
            </p>
            <p>
              <strong>2.3 Official User Telemetry:</strong> Authenticated identifiers of operating officers, including designated role (SDMA, District Collector, Municipal Officer), institutional jurisdiction, session timestamps, and dispatch audit records.
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>3. Purpose of Processing and Data Protection Standards</span>
          </h2>
          <p>
            Information collected by GCVIAS is utilized strictly for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Computing spatial risk rankings and critical infrastructure exposure during cyclonic events.</li>
            <li>Generating structured evacuation directives and sectoral advisories for administrative officers.</li>
            <li>Maintaining an unalterable audit log of emergency notifications issued to coastal emergency response units.</li>
          </ul>
          <p>
            GCVIAS does not sell, commercialize, or profile user information for non-emergency or commercial purposes. All data transmissions are encrypted using Transport Layer Security (TLS 1.3) protocols.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            4. Third-Party Geospatial and Cartographic Services
          </h2>
          <p>
            GCVIAS interfaces with third-party cartographic and satellite basemap providers (including CARTO, OpenStreetMap contributors, and ESRI World Imagery). Requests made to retrieve map tiles transmit standard IP headers and bounding box coordinates necessary for spatial rendering. No sensitive infrastructure vulnerability ratings or classified operational orders are transmitted to external tile servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            5. Audit Logging and Data Retention Policy
          </h2>
          <p>
            In compliance with statutory emergency governance guidelines, all advisory dispatch actions, including timestamp, operator role, target jurisdiction, and broadcast text, are recorded in immutable audit logs. Audit logs are retained for a minimum period of seven (7) years to facilitate post-disaster operational reviews and statutory commission inquiries.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>6. Contact Information and Data Protection Officer</span>
          </h2>
          <p>
            Inquiries regarding this Privacy Policy or requests for audit log verification should be directed to the designated nodal officer:
          </p>
          <div className="bg-command-950 border border-command-800 rounded p-3 font-mono text-[11px] text-slate-400">
            Office of the Chief Geospatial Resilience Officer<br />
            State Emergency Operations Center (SEOC)<br />
            Email: privacy@gcvias.resilience.gov.in<br />
            Official Portal: https://gcvias.resilience.gov.in
          </div>
        </section>
      </div>
    </div>
  );
};
