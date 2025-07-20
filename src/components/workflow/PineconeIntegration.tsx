
import React, { useState } from 'react';
import { Search, Database, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkflow } from '@/hooks/useWorkflow';
import { usePineconeWorkflow } from '@/hooks/usePineconeWorkflow';
import { Skeleton } from '@/components/ui/skeleton';

export function PineconeIntegration() {
  const { currentWorkflow } = useWorkflow();
  const { isInitialized, isLoading, findSimilarWorkflows } = usePineconeWorkflow();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{id: string, score: number}[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await findSimilarWorkflows(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  if (!isInitialized) {
    return (
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
            Pinecone Not Connected
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          <p>Pinecone vector database is initializing. Vector search capabilities will be available soon.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Database className="h-4 w-4 mr-2 text-indigo-500" />
          Pinecone Vector Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="text-xs text-muted-foreground">
          {currentWorkflow ? 
            <p>Current workflow is indexed in Pinecone for semantic search and similarity matching.</p> :
            <p>Search for workflows semantically or find similar workflows.</p>
          }
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search for similar workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm h-8"
            />
          </div>
          <Button size="sm" disabled={isLoading || isSearching} onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        {isSearching ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-2 pt-2">
            <p className="text-xs font-medium">Results:</p>
            {searchResults.map((result) => (
              <div 
                key={result.id} 
                className="flex items-center justify-between p-2 rounded-md border text-sm"
              >
                <div className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span>Workflow {result.id}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {Math.round(result.score * 100)}% match
                </Badge>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <p className="text-xs text-center text-muted-foreground pt-2">No results found</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
