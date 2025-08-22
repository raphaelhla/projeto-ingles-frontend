

interface DashboardStatCardProps {
  children: React.ReactNode;
  bgColor: string;
  title: string;
  value: string | number;
}

export const DashboardStatCard = ({ children, bgColor, title, value }: DashboardStatCardProps) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">

        <div className="p-5">

            <div className="flex items-center">

                <div className={`flex-shrink-0 w-8 h-8 ${bgColor} rounded-md flex items-center justify-center`}>
                    {children}
                </div>

                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd className="text-lg font-medium text-gray-900">{value}</dd>
                    </dl>
                </div>

            </div>

        </div>

    </div>
);