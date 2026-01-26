import logo from '@/assets/logo.png';

export const EmptyEditorState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[hsl(var(--editor-bg))] text-center p-8">
      <img 
        src={logo} 
        alt="Pocket Code Studio" 
        className="w-20 h-20 object-contain mb-6"
      />
      <h2 className="text-xl font-semibold text-foreground mb-2">Pocket Code Studio</h2>
      <p className="text-muted-foreground text-sm max-w-[240px]">
        Choose a file from the sidebar and start coding.
      </p>
    </div>
  );
};
