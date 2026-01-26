import { useNavigate } from 'react-router-dom';
import { FolderPlus, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

const Home = () => {
  const navigate = useNavigate();

  const handleNewProject = () => {
    navigate('/editor', { state: { mode: 'new' } });
  };

  const handleOpenProject = () => {
    navigate('/editor', { state: { mode: 'open' } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background p-6">
      <div className="flex flex-col items-center gap-6 max-w-sm w-full">
        {/* Logo */}
        <img 
          src={logo} 
          alt="Pocket Code Studio" 
          className="w-32 h-32 object-contain"
        />
        
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Pocket Code Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Code anywhere, anytime
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full mt-4">
          <Button 
            onClick={handleNewProject}
            className="w-full h-14 text-base gap-3"
            size="lg"
          >
            <FolderPlus className="w-5 h-5" />
            Create New Project
          </Button>
          
          <Button 
            onClick={handleOpenProject}
            variant="outline"
            className="w-full h-14 text-base gap-3"
            size="lg"
          >
            <FolderOpen className="w-5 h-5" />
            Open Existing Project
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground mt-8">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
};

export default Home;
