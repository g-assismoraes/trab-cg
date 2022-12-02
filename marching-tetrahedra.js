function makeMesh(){
        let x = [];
        let y = [];
        let z = [];

        let r = 0.125;
        
        let aux= -1;
        while (aux <= 1){ //cria a nuvem de pontos inicial
            x.push(aux);
            y.push(aux);
            z.push(aux);
            aux=parseFloat((aux+0.01).toFixed(5)); //garante float
        };

        let grao=x.length

        let cubos = []
        for (let ix=0; ix < grao; ix+=1){
            for (let iy=0; iy < grao; iy+=1){
                for (let iz=0; iz < grao; iz+=1){
                    cubos.push([x[ix], y[iy], z[iz], 0]) //ultimo valor eh o isovalor
                }
            }
        } 
        
        for (let ic=0;ic < cubos.length;ic+=1){
            //equacao parametrica da esfera x*x + y*y + z*z < r
            if (parseFloat((parseFloat((cubos[ic][0]*cubos[ic][0]).toFixed(5))+
                                        parseFloat((cubos[ic][1]*cubos[ic][1]).toFixed(5))+
                                        parseFloat((cubos[ic][2]*cubos[ic][2]).toFixed(5))).toFixed(5)) < r){
                cubos[ic][3]=1 
            }
        }
        
        let triangulos=[]
        let vertices=[]
        for (let ix=0;ix < grao-1;ix+=1){ //marching
            for (let iy=0;iy < grao-1;iy+=1){
                for (let iz=0;iz < grao-1;iz+=1){//vertice para cada cubro
                    let v1=cubos[iz+grao*iy+grao*grao*ix]
                    let v2=cubos[iz+grao*iy+grao*grao*ix+1]
                    let v3=cubos[iz+grao*iy+grao*grao*ix+grao]
                    let v4=cubos[iz+grao*iy+grao*grao*ix+grao+1]
                    let v5=cubos[iz+grao*iy+grao*grao*ix+grao*grao]
                    let v6=cubos[iz+grao*iy+grao*grao*ix+grao*grao+1]
                    let v7=cubos[iz+grao*iy+grao*grao*ix+grao*grao+grao]
                    let v8=cubos[iz+grao*iy+grao*grao*ix+grao*grao+grao+1]

                    let tVertices = [v1,v3,v5,v6] //define tetraedro
                    //teste dos casos dentro fora do tetraedro
                    let t = tVertices[0][3]+ tVertices[1][3]+ tVertices[2][3]+ tVertices[3][3]
                    if (t != 0 && t != 4 ){ //ignora os casos todos dentro e todos fora
                        if(t == 1 || t==3){ //caso ou somente 1 fora ou somente 1 dentro

                            //testes para saber qual e o dentro e fora
                            if (tVertices[0][3]+t==2 || tVertices[0][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                //corrige o sentido dos triangulos
                                if(tVertices[0][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                 
                            } 
                            else if (tVertices[1][3]+t==2 || tVertices[1][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[1][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[1]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[1]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                            else if (tVertices[2][3]+t==2 || tVertices[2][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[2][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[2]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[2]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                            else if (tVertices[3][3]+t==2 || tVertices[3][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[3][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[3][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[3][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[3]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[3]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                        }
                        else{
                            if(tVertices[0][3]==tVertices[1][3]){
                                let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                
                                if(tVertices[0][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                    }
                                }
                    
                            }
                            else{
                                if(tVertices[0][3]==tVertices[2][3]){
                                    let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr2=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                    let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                    if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                    if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                    if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                    
                                    if(tVertices[0][3]){
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                                    else{
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                    
                                }
                                else{
                                    let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                    let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                    if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                    if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                    if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                    
                                    if(tVertices[0][3]){
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                                    else{
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                    
                                }
                            }
                    
                        }
                    }

                    tVertices = [v1,v2,v3,v6]
                    t = tVertices[0][3]+ tVertices[1][3]+ tVertices[2][3]+ tVertices[3][3]
                    if (t != 0 && t != 4 ){
                        if(t == 1 || t==3){
                            if (tVertices[0][3]+t==2 || tVertices[0][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                    
                                if(tVertices[0][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                    
                                
                            } 
                            else if (tVertices[1][3]+t==2 || tVertices[1][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[1][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[1]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[1]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                            else if (tVertices[2][3]+t==2 || tVertices[2][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[2][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[2]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[2]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                            else if (tVertices[3][3]+t==2 || tVertices[3][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[3][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[3][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[3][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[3]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[3]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                        }
                        else{
                            if(tVertices[0][3]==tVertices[1][3]){
                                let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                
                                if(tVertices[0][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                    }
                                }
                    
                                
                    
                    
                    
                            }
                            else{
                                if(tVertices[0][3]==tVertices[2][3]){
                                    let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr2=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                    let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                    if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                    if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                    if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                    
                                    if(tVertices[0][3]){
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                                    else{
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                    
                                }
                                else{
                                    let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                    let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                    if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                    if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                    if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                    
                                    if(tVertices[0][3]){
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                                    else{
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                    
                                }
                            }
                    
                        }
                    }



                    tVertices= [v2,v3,v4,v6]
                    t = tVertices[0][3]+ tVertices[1][3]+ tVertices[2][3]+ tVertices[3][3]
                    if (t != 0 && t != 4 ){
                        if(t == 1 || t==3){ 
                            if (tVertices[0][3]+t==2 || tVertices[0][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                    
                                if(tVertices[0][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                    
                                
                            } 
                            else if (tVertices[1][3]+t==2 || tVertices[1][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[1][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[1]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[1]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                            else if (tVertices[2][3]+t==2 || tVertices[2][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[2][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[2]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[2]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                            else if (tVertices[3][3]+t==2 || tVertices[3][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[3][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[3][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[3][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[3]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[3]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                        }
                        else{
                            if(tVertices[0][3]==tVertices[1][3]){
                                let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                
                                if(tVertices[0][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                    }
                                }
                    
                                
                    
                    
                    
                            }
                            else{
                                if(tVertices[0][3]==tVertices[2][3]){
                                    let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr2=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                    let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                    if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                    if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                    if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                    
                                    if(tVertices[0][3]){
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                                    else{
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                    
                                }
                                else{
                                    let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                    let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                    if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                    if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                    if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                    
                                    if(tVertices[0][3]){
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                                    else{
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                    
                                }
                            }
                    
                        }
                    }


                    tVertices= [v3,v4,v6,v8]
                    t = tVertices[0][3]+ tVertices[1][3]+ tVertices[2][3]+ tVertices[3][3]
                    if (t != 0 && t != 4 ){
                        if(t == 1 || t==3){
                            if (tVertices[0][3]+t==2 || tVertices[0][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                    
                                if(tVertices[0][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                    
                                
                            } 
                            else if (tVertices[1][3]+t==2 || tVertices[1][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[1][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[1]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[1]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                            else if (tVertices[2][3]+t==2 || tVertices[2][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[2][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[2]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[2]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                            else if (tVertices[3][3]+t==2 || tVertices[3][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[3][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[3][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[3][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[3]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[3]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                        }
                        else{
                            if(tVertices[0][3]==tVertices[1][3]){
                                let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                
                                if(tVertices[0][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                    }
                                }
                    
                                
                    
                    
                    
                            }
                            else{
                                if(tVertices[0][3]==tVertices[2][3]){
                                    let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr2=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                    let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                    if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                    if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                    if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                    
                                    if(tVertices[0][3]){
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                                    else{
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                    
                                }
                                else{
                                    let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                    let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                    if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                    if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                    if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                    
                                    if(tVertices[0][3]){
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                                    else{
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                    
                                }
                            }
                    
                        }
                    }
                    


                    tVertices = [v3,v6,v7,v8]
                    t = tVertices[0][3]+ tVertices[1][3]+ tVertices[2][3]+ tVertices[3][3]
                    if (t != 0 && t != 4 ){
                        if(t == 1 || t==3){
                            if (tVertices[0][3]+t==2 || tVertices[0][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                    
                                if(tVertices[0][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                    
                                
                            } 
                            else if (tVertices[1][3]+t==2 || tVertices[1][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[1][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[1]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[1]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                            else if (tVertices[2][3]+t==2 || tVertices[2][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[2][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[2]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[2]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                            else if (tVertices[3][3]+t==2 || tVertices[3][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[3][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[3][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[3][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[3]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[3]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                        }
                        else{
                            if(tVertices[0][3]==tVertices[1][3]){
                                let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                
                                if(tVertices[0][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                    }
                                }
                    
                                
                    
                    
                    
                            }
                            else{
                                if(tVertices[0][3]==tVertices[2][3]){
                                    let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr2=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                    let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                    if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                    if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                    if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                    
                                    if(tVertices[0][3]){
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                                    else{
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                    
                                }
                                else{
                                    let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                    let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                    if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                    if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                    if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                    
                                    if(tVertices[0][3]){
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                                    else{
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                    
                                }
                            }
                    
                        }
                    }


                    
                    tVertices = [v3,v5,v6,v7]
                    t = tVertices[0][3]+ tVertices[1][3]+ tVertices[2][3]+ tVertices[3][3]
                    if (t != 0 && t != 4 ){
                        if(t == 1 || t==3){
                            if (tVertices[0][3]+t==2 || tVertices[0][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                    
                                if(tVertices[0][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                    
                                
                            } 
                            else if (tVertices[1][3]+t==2 || tVertices[1][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[1][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[1]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[1]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                            else if (tVertices[2][3]+t==2 || tVertices[2][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[2][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[2]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[2]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                            else if (tVertices[3][3]+t==2 || tVertices[3][3]+t==3){
                                let tr1=[parseFloat((parseFloat((tVertices[3][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[3][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[3][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                
                                if(tVertices[3][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[3]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[3]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                }
                                
                            }
                        }
                        else{
                            if(tVertices[0][3]==tVertices[1][3]){
                                let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                
                                if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                
                                if(tVertices[0][3]){
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                    }
                                }
                                else{
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                    }
                                    if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                    
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                        
                                    }else{
                                        triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                    }
                                }
                    
                                
                    
                    
                    
                            }
                            else{
                                if(tVertices[0][3]==tVertices[2][3]){
                                    let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr2=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                    let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                    if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                    if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                    if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                    
                                    if(tVertices[0][3]){
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                                    else{
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                    
                                }
                                else{
                                    let tr1=[parseFloat((parseFloat((tVertices[2][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[2][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr2=[parseFloat((parseFloat((tVertices[1][0]+tVertices[3][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[1][1]+tVertices[3][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[1][2]+tVertices[3][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    let tr3=[parseFloat((parseFloat((tVertices[0][0]+tVertices[2][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[2][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[2][2]).toFixed(5))/2).toFixed(5)),1.0]
                    
                                    let tr4=[parseFloat((parseFloat((tVertices[0][0]+tVertices[1][0]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][1]+tVertices[1][1]).toFixed(5))/2).toFixed(5)),
                                    parseFloat((parseFloat((tVertices[0][2]+tVertices[1][2]).toFixed(5))/2).toFixed(5)),1.0]
                                    
                                    if(!vertices.some(a => tr1.every((v,i) => v==a[i]))){vertices.push(tr1)}
                                    if(!vertices.some(a => tr2.every((v,i) => v==a[i]))){vertices.push(tr2)}
                                    if(!vertices.some(a => tr3.every((v,i) => v==a[i]))){vertices.push(tr3)}
                                    if(!vertices.some(a => tr4.every((v,i) => v==a[i]))){vertices.push(tr4)}
                                    
                                    if(tVertices[0][3]){
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) > (Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                                    else{
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr1,tr2,tr3))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr1.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr2.every((v,i) => v==a[i]))])
                                        }
                                        if (arcCos(anguloVetor(twoPointToVector(tr3,tVertices[0]),normaTriangulo(tr2,tr3,tr4))) <(Math.PI/2)){
                                        
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i]))])
                                            
                                        }else{
                                            triangulos.push([vertices.findIndex(a => tr2.every((v,i) => v==a[i])),vertices.findIndex(a => tr4.every((v,i) => v==a[i])),vertices.findIndex(a => tr3.every((v,i) => v==a[i]))])
                                        }
                                    }
                    
                                }
                            }
                    
                        }
                    }
                    

                    
                }
            }
        }
        return [vertices,triangulos]
};

function anguloVetor(va,vb){
    return (va[0]*vb[0] + va[1]*vb[1] + va[2]*vb[2] ) / (Math.sqrt(va[0]*va[0] + va[1]*va[1] + va[2]*va[2])*Math.sqrt(vb[0]*vb[0] + vb[1]*vb[1] + vb[2]*vb[2]))
}

function arcCos(c){
    if(c>=0){return 0}
    else{return Math.PI}
}
function normaTriangulo(a,b,c){
    return [(b[1]-a[1])*(c[2]-a[2])-(c[1]-a[1])*(b[2]-a[2]) ,
            (b[2]-a[2])*(c[0]-a[0])-(c[2]-a[2])*(b[0]-a[0]),
            (b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1])]
}


function twoPointToVector(va,vb){
    return[vb[0]-va[0],vb[1]-va[1],vb[2]-va[2]]

}
function writeFile() {
    const fs = require('fs')

    let mesh = makeMesh()
    let v = mesh[0]
    let t = mesh[1]


    let data =`${v.length} ${t.length}\n`
    for (let iv = 0 ;iv < v.length; iv++){data+=`${v[iv][0]} ${v[iv][1]} ${v[iv][2]} ${v[iv][3]}\n`}
    for (let it = 0 ;it < t.length-1; it++){data+=`${t[it][0]} ${t[it][1]} ${t[it][2]}\n`}
    data+=`${t[t.length-1][0]} ${t[t.length-1][1]} ${t[t.length-1][2]}`




    fs.writeFile('esfera2.obj', data, (err) => {
        if (err) throw err;
    })

}


writeFile()


