interface DragGroupProps {
  children: any
  className?: string
}

function DragGroup({ children, className }: DragGroupProps) {
  return <div className={`flex flex-wrap gap-2 justify-center items-center border-2 p-6 rounded-md ${className}`}>{children}</div>
}

export default DragGroup
