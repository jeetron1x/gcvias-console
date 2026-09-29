import React, { useState } from 'react';
import { InfrastructureAsset, AssetType } from '../types';
import {
  Database,
  Search,
  Filter,
  Download,
  Zap,
  Building2,
  Home,
  Navigation
} from 'lucide-react';

interface InfrastructureRegistryPageProps {
  assets: InfrastructureAsset[];
  onSelectAssetOnMap: (asset: InfrastructureAsset) => void;
}

export const InfrastructureRegistryPage: React.FC<InfrastructureRegistryPageProps> = ({
  assets,
  onSelectAssetOnMap,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');

  // Filter logic
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesDistrict = districtFilter === 'all' || asset.district === districtFilter;

    return matchesSearch && matchesType && matchesDistrict;
  });

  // Extract unique districts
  const districts = Array.from(new Set(assets.map((a) => a.district))).sort();

  // Export to CSV
  const handleExportCsv = () => {
    const headers = ['Asset ID', 'Name', 'Type', 'District', 'Block', 'Latitude', 'Longitude', 'Elevation MSL (m)'];
    const rows = filteredAssets.map((a) => [
      a.id,
      `"${a.name.replace(/"/g, '""')}"`,
      a.type,
      a.district,
      a.block,
      a.lat,
      a.lng,
      a.elevationMeters
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gcvias-infrastructure-registry-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'substation':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'hospital':
        return <Building2 className="w-3.5 h-3.5 text-blue-400" />;
      case 'shelter':
        return <Home className="w-3.5 h-3.5 text-emerald-400" />;
      case 'highway':
        return <Navigation className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4 font-sans text-slate-200">
      {/* Page Header */}
      <div className="bg-command-900 border border-command-800 rounded-lg p-4 shadow">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded bg-command-800 text-amber-400 border border-command-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold font-mono text-white tracking-wide">
                CRITICAL INFRASTRUCTURE ASSET REGISTRY
              </h1>
              <p className="text-xs text-slate-400">
                Geo-referenced repository of power grid nodes, multipurpose cyclone shelters, medical facilities, and arterial corridors
              </p>
            </div>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-command-800 hover:bg-command-700 text-slate-200 text-xs font-mono font-bold rounded-md border border-command-700 transition-colors"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>EXPORT CSV</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-command-800 text-xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by facility name, block, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-command-950 border border-command-700 rounded-md pl-9 pr-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-command-500 text-xs font-sans"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              aria-label="Filter by Infrastructure Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-command-950 border border-command-700 rounded-md px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-command-500 text-xs font-mono"
            >
              <option value="all">All Infrastructure Types ({assets.length})</option>
              <option value="substation">Electrical Grid Substations</option>
              <option value="hospital">Hospitals and Health Centres</option>
              <option value="shelter">Multipurpose Cyclone Shelters</option>
              <option value="highway">Highways and Transport Corridors</option>
            </select>
          </div>

          {/* District Filter */}
          <div>
            <select
              aria-label="Filter by Administrative District"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full bg-command-950 border border-command-700 rounded-md px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-command-500 text-xs font-mono"
            >
              <option value="all">All Administrative Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d} District
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-command-900 border border-command-800 rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2.5 bg-command-850 border-b border-command-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>SHOWING {filteredAssets.length} REGISTERED ASSETS</span>
          <span>DATUM: WGS-84 / MSL ELEVATION</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="bg-command-950 text-slate-400 font-mono text-[11px] border-b border-command-800">
                <th className="py-2.5 px-3">Asset ID</th>
                <th className="py-2.5 px-3">Facility Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">District / Block</th>
                <th className="py-2.5 px-3">Coordinates</th>
                <th className="py-2.5 px-3">Elevation</th>
                <th className="py-2.5 px-3">Key Technical Attributes</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-command-800/80">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-command-850/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-amber-400">{asset.id}</td>
                  <td className="py-2.5 px-3 font-bold text-white max-w-[220px]">{asset.name}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-command-800 border border-command-700 text-slate-300 font-mono text-[11px] capitalize">
                      {getAssetIcon(asset.type)}
                      <span>{asset.type}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    <div>{asset.district}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{asset.block} Block</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                    {asset.lat.toFixed(3)}N, {asset.lng.toFixed(3)}E
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">
                    {asset.elevationMeters}m MSL
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                    {asset.type === 'substation' && (
                      <span>
                        {asset.voltageKv}kV ({asset.feederCount} feeders) | Plinth:{' '}
                        {asset.hasPlinthProtection ? 'Protected' : 'Unprotected'}
                      </span>
                    )}
                    {asset.type === 'shelter' && (
                      <span>
                        Cap: {asset.designCapacity} (Surge: {asset.surgeCapacity}) | Stilts:{' '}
                        {asset.elevatedStilts ? 'Yes' : 'No'} | Solar:{' '}
                        {asset.solarGeneratorPower ? 'Active' : 'No'}
                      </span>
                    )}
                    {asset.type === 'hospital' && (
                      <span>
                        Beds: {asset.bedCapacity} (ICU: {asset.icuBeds}) | Oxygen: {asset.oxygenBufferDays}d
                      </span>
                    )}
                    {asset.type === 'highway' && (
                      <span>
                        Route: {asset.routeDesignation} | Length: {asset.lengthKm}km | Tide Clearance:{' '}
                        {asset.elevationAboveHighTideMeters}m
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectAssetOnMap(asset)}
                      className="px-2 py-1 bg-command-800 hover:bg-command-700 text-amber-400 font-mono text-[10px] rounded border border-command-700 transition-colors"
                    >
                      MAP LOCATE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
