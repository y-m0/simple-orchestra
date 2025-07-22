@@ .. @@
   const [searchQuery, setSearchQuery] = useState('');
   const [searchDebounce, setSearchDebounce] = useState('');
   
+  // Get URL parameters
+  useEffect(() => {
+    const params = new URLSearchParams(location.search);
+    const swarmParam = params.get('swarm');
+    const agentParam = params.get('agent');
+    
+    if (swarmParam) {
+      setSelectedSwarm(swarmParam);
+    }
+    if (agentParam) {
+      setSelectedAgent(agentParam);
+    }
+  }, [location.search]);
+  
   // Debounced search
   useEffect(() => {
     const timer = setTimeout(() => {