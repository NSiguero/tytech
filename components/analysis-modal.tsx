'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Package, Tag, Eye, DollarSign, X } from 'lucide-react';

interface ProductoDetectado {
  id: number;
  foto_id: number;
  producto_id?: string;
  nombre: string;
  marca?: string;
  facing: number;
  precio_detectado?: string;
  es_reconocido: boolean;
  confidence?: number;
  bounding_box?: any;
  created_at: Date;
}

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  filename: string;
  productos: ProductoDetectado[];
}

export function AnalysisModal({ isOpen, onClose, imageUrl, filename, productos }: AnalysisModalProps) {
  const formatPrice = (price: string) => {
    if (!price) return 'No disponible';
    return price;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const recognizedCount = productos.filter(p => p.es_reconocido).length;
  const unrecognizedCount = productos.filter(p => !p.es_reconocido).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-6 w-6" />
            Análisis de Productos
          </DialogTitle>
          
          {/* Price Accuracy Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-2">
                <p className="text-xs text-yellow-700">
                  <strong>Note:</strong> Product prices may not be completely accurate.
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={imageUrl}
                alt={filename}
                className="w-full h-auto rounded-xl border-2 border-gray-200 shadow-lg"
              />
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md">
                <span className="text-sm font-semibold text-gray-700">
                  {productos.length} producto{productos.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">{recognizedCount}</div>
                <div className="text-sm text-green-700">Reconocidos</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-600">{unrecognizedCount}</div>
                <div className="text-sm text-orange-700">No Reconocidos</div>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Productos Encontrados</h3>
              <Badge variant="outline" className="text-sm">
                {productos.length} total
              </Badge>
            </div>
            
            {productos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No se detectaron productos</p>
                <p className="text-sm">La imagen no contiene productos reconocibles</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {productos.map((producto) => (
                  <div key={producto.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-lg truncate">
                          {producto.nombre}
                        </h4>
                        {producto.marca && (
                          <p className="text-sm text-gray-600 mt-1">
                            Marca: <span className="font-medium">{producto.marca}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        {!producto.es_reconocido && (
                          <Badge variant="destructive" className="text-xs">
                            No Reconocido
                          </Badge>
                        )}
                        {producto.confidence && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getConfidenceColor(producto.confidence)}`}
                          >
                            {Math.round(producto.confidence * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-700">
                          <span className="font-medium">{producto.facing}</span> unidades
                        </span>
                      </div>
                      
                      {producto.precio_detectado && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700">
                            <span className="font-medium">{formatPrice(producto.precio_detectado)}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 