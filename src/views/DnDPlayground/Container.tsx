interface ContainerProps {
  title: string
  children: any
}

function Container({ title, children }: ContainerProps) {
  return (
    <div className="p-2 border-2 rounded-xl">
      <h2 className="text-center mb-3">{title}</h2>
      <div className="relative after:block after:pb-[100%]">
        <div className="absolute top-0 right-0 bottom-0 left-0">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Container
