import { Rocket, TrendUp, Target, Users, MapPin, ChartLine, Lightbulb, Star } from "phosphor-react";

interface GrowthTabProps {
  // Add props as needed
}

export default function GrowthTab(_props: GrowthTabProps) {
  return (
    <div className="space-y-6">
      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue Growth</p>
              <p className="text-2xl font-bold text-green-600 mt-1">+28.5%</p>
              <p className="text-sm text-gray-500 mt-1">vs last quarter</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <TrendUp size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Market Expansion</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">3</p>
              <p className="text-sm text-gray-500 mt-1">new cities</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <MapPin size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customer Base</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">+1,247</p>
              <p className="text-sm text-gray-500 mt-1">new customers</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fleet Expansion</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">+45</p>
              <p className="text-sm text-gray-500 mt-1">new vehicles</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <Rocket size={24} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Growth Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Growth Initiatives</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <Target size={20} className="text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">Market Expansion</h4>
                    <p className="text-sm text-gray-600 mt-1">Launch in Portland and Denver markets</p>
                    <div className="flex items-center mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                      <span className="text-sm text-gray-600 ml-2">75%</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-green-600 font-medium">Q2 2024</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <ChartLine size={20} className="text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">Premium Service Launch</h4>
                    <p className="text-sm text-gray-600 mt-1">High-end luxury vehicle rental tier</p>
                    <div className="flex items-center mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                      <span className="text-sm text-gray-600 ml-2">45%</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-blue-600 font-medium">Q3 2024</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <Lightbulb size={20} className="text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">AI-Powered Optimization</h4>
                    <p className="text-sm text-gray-600 mt-1">Smart pricing and fleet management</p>
                    <div className="flex items-center mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '20%'}}></div>
                      </div>
                      <span className="text-sm text-gray-600 ml-2">20%</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-purple-600 font-medium">Q4 2024</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Growth Forecast</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Revenue Target</span>
                <span className="text-sm font-bold text-green-600">$2.5M (85%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Fleet Size Target</span>
                <span className="text-sm font-bold text-blue-600">500 vehicles (78%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{width: '78%'}}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Market Presence</span>
                <span className="text-sm font-bold text-purple-600">12 cities (60%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-purple-600 h-3 rounded-full" style={{width: '60%'}}></div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Key Growth Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer Retention</p>
                  <p className="text-lg font-bold text-gray-900">94.2%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Net Promoter Score</p>
                  <p className="text-lg font-bold text-gray-900">8.7/10</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Market Share</p>
                  <p className="text-lg font-bold text-gray-900">15.3%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Growth Rate</p>
                  <p className="text-lg font-bold text-green-600">+28.5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Opportunities */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Growth Opportunities</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star size={32} className="text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Customer Experience Enhancement</h4>
              <p className="text-sm text-gray-600 mb-4">Implement personalized booking experiences and loyalty programs</p>
              <div className="text-sm text-green-600 font-medium">+15% revenue potential</div>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Rocket size={32} className="text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Technology Integration</h4>
              <p className="text-sm text-gray-600 mb-4">IoT vehicle monitoring and predictive maintenance systems</p>
              <div className="text-sm text-blue-600 font-medium">+20% efficiency gain</div>
            </div>

            <div className="text-center">
              <div className="bg-purple-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target size={32} className="text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Strategic Partnerships</h4>
              <p className="text-sm text-gray-600 mb-4">Corporate partnerships and travel agency integrations</p>
              <div className="text-sm text-purple-600 font-medium">+25% market reach</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
